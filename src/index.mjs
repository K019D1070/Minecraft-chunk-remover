import fs from "fs";
const fsp = fs.promises;
import config from "config";
import { Buffer } from 'buffer';

const kc = config.get("keepChunk");
const path = config.get("path");

main();
function main(){
  const targetRegions = [];
  const chunkInRegion = {};
  kc.forEach((chunk)=>{
    //r.[x].[z].mca
    let regionFileName = `r.${chunk.x>> 5}.${chunk.y>> 5}.mca`;
    if(targetRegions.includes(regionFileName)){
      chunkInRegion[regionFileName].push(chunk);
    }else{
      chunkInRegion[regionFileName] = [chunk];
      targetRegions.push(regionFileName);
    }
  });
  targetRegions.forEach((region)=>{
    fsp.open(path+region, "r+").then(async (regionHandle)=>{
      let regionData = await regionHandle.readFile();
      let processedArrayBuffer = Buffer.alloc(regionData.byteLength);
      chunkInRegion[region].forEach((chunk)=>{
        let chunkInfoPos = 4* ((Number(chunk.x)% 32)+ (Number(chunk.z)% 32)* 32);
        let chunkPositionSector = regionData.readIntBE(chunkInfoPos, 3);
        let chunkLengthSector = regionData.readIntBE(chunkInfoPos+ 3, 1);
        
        //prepare porting buffer
        let chunkInfoBuffer = regionData.slice(chunkInfoPos, chunkInfoPos+4);
        let chunkBuffer = regionData.slice(sectorToByte(chunkPositionSector), sectorToByte(chunkPositionSector)+ sectorToByte(chunkLengthSector));
        processedArrayBuffer.fill(chunkInfoBuffer, chunkInfoPos, chunkInfoPos+ chunkInfoBuffer.byteLength);
        processedArrayBuffer.fill(chunkBuffer, sectorToByte(chunkPositionSector), sectorToByte(chunkPositionSector)+ chunkBuffer.byteLength);
      });
      await regionHandle.close();
      await fsp.writeFile(path+region, processedArrayBuffer);
    });
  });
}
function sectorToByte(sector){
  return sector* 1024* 4;
}