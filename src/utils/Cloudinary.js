import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
          
cloudinary.config({ 
  cloud_name:"dkrsmfvuc" , 
  api_key:"789989316855571" , 
  api_secret: "NC1e8uoto_I4h-e89GA_QLkymXM"
});
    
const fileCoudinary = async (localpath)=>{

  try {
    if(!localpath) return null

    const ressponse = await cloudinary.uploader.upload(localpath,
     { resource_type:"auto"})
 
    //  console.log(`file is uploaded on cloudinary` ,ressponse.url)
    fs.unlinkSync(localpath)
     return ressponse
 
  } catch (error) {
    fs.unlinkSync(localpath)
    return null
  }
}

const deleteOnCloudinary = async (public_id, resource_type="image") => {
  try {
      if (!public_id) return null;

      //delete file from cloudinary
      const result = await cloudinary.uploader.destroy(public_id, {
          resource_type: `${resource_type}`
      });
  } catch (error) {
     
      console.log("delete on cloudinary failed", error);
  }
};

 
export {fileCoudinary , deleteOnCloudinary}
   