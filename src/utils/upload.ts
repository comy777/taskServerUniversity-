import cloudinary from "cloudinary";
cloudinary.v2.config(process.env.CLOUDINARY_URL);

export const uploadImageCloudinary = async (image: any) => {
  const extensionsValid = ["png", "jpg", "jpeg"];
  const { name, tempFilePath } = image;
  const nameExtension = name.split(".");
  const extension = nameExtension[nameExtension.length - 1];
  if (!extensionsValid.includes(extension)) return;
  return await cloudinary.v2.uploader.upload(tempFilePath, {
    upload_preset: process.env.UPLOAD_PRESET,
  });
};

export const deleteImage = async (id: string) => {
  const public_id = id.trim();
  try {
    await cloudinary.v2.uploader.destroy(`Notes/${public_id}`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
