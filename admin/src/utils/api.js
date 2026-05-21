import axios from 'axios';

export const getAuthHeader = () => {
  if (typeof window === 'undefined') return null;
  const adminInfo = localStorage.getItem("adminInfo");
  if (!adminInfo) return null;
  const token = JSON.parse(adminInfo).token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const uploadFileToServer = async (file) => {
  const config = getAuthHeader();
  if (!config) {
    throw new Error("Please login to upload images");
  }

  const uploadConfig = {
    headers: {
      ...config.headers,
      "Content-Type": "multipart/form-data"
    }
  };

  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, formData, uploadConfig);
  if (res.data && res.data.url) {
    return res.data.url;
  } else {
    throw new Error("Failed to retrieve image URL from server");
  }
};
