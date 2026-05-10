const uploadToCloudinary = async (file) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "Audra music");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dqc8qmbo9/auto/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    return data.secure_url;
  } catch (error) {
    console.error("Upload failed:", error);
  }
};

export default uploadToCloudinary;
