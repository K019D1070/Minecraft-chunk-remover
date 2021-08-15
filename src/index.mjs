import fs from "fs";
const fsp = fs.promises;
import config from "config";
import { Buffer } from 'buffer';
import path from "path";

const worlds = config.get("worlds");
const every = config.get("every");
const serverPath = config.get("serverPath");

main();
function main(){
  worlds.forEach((world)=>{
    fsp.readdir(path.join(serverPath, world.name, "region")).then((regionFiles)=>{
      const targetRegions = [];
      const chunkInRegion = {};
      world.keepChunk.forEach((chunk)=>{
        //r.[x].[z].mca
        let regionFileName = `r.${chunk.x>> 5}.${chunk.y>> 5}.mca`;
        if(targetRegions.includes(regionFileName)){
          chunkInRegion[regionFileName].push(chunk);
        }else{
          chunkInRegion[regionFileName] = [chunk];
          targetRegions.push(regionFileName);
        }
      });
      regionFiles.forEach((file)=>{
        if(!targetRegions.includes(file)){
          fsp.rm(path.join(serverPath, world.name, "region", file));
        }
      });
      targetRegions.forEach((region)=>{
        fsp.open(path.join(serverPath, world.name, "region", region), "r+").then(async (regionHandle)=>{
          let regionData = await regionHandle.readFile();
          //Content of new region file.
          let processedArrayBuffer = Buffer.alloc(regionData.byteLength);
          chunkInRegion[region].forEach((chunk)=>{
            //Collect chunk infomation
            let chunkInfoPos = 4* ((Number(chunk.x)% 32)+ (Number(chunk.z)% 32)* 32);
            let chunkPositionSector = regionData.readIntBE(chunkInfoPos, 3);
            let chunkLengthSector = regionData.readIntBE(chunkInfoPos+ 3, 1);
            //Collect Chunk data(binary)
            let chunkInfoBuffer = regionData.slice(chunkInfoPos, chunkInfoPos+4);
            let chunkBuffer = regionData.slice(sectorToByte(chunkPositionSector), sectorToByte(chunkPositionSector)+ sectorToByte(chunkLengthSector));
            //Port chunk data for content of new region file.
            processedArrayBuffer.fill(chunkInfoBuffer, chunkInfoPos, chunkInfoPos+ chunkInfoBuffer.byteLength);
            processedArrayBuffer.fill(chunkBuffer, sectorToByte(chunkPositionSector), sectorToByte(chunkPositionSector)+ chunkBuffer.byteLength);
          });
          await regionHandle.close();
          await fsp.writeFile(path.join(serverPath, world.name, "region", region), processedArrayBuffer);
          console.log("Edited region:", region);
        });
      });
    });
  });
}
function sectorToByte(sector){
  return sector* 1024* 4;
}