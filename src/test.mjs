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
    let regionFileName = `r.${chunk.x >> 5}.${chunk.y >> 5}.mca`;
    if(targetRegions.includes(regionFileName)){
      chunkInRegion[regionFileName].push(chunk);
    }else{
      chunkInRegion[regionFileName] = [chunk];
      targetRegions.push(regionFileName);
    }
  });
  targetRegions.forEach((region)=>{
    console.log(region);
    fsp.open("hoge.txt", "r+").then(async (regionHandle)=>{
      let regionData = await regionHandle.readFile();
      await regionHandle.write(regionData);
      regionHandle.close();
    });
  });
}
function sectorToByte(sector){
  return sector* 1024* 4;
}