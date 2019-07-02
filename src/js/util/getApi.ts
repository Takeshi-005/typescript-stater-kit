import axios from "axios";

export default async (url: string, params = {}) => {
  try {
    const result = await axios.get(`${url}`, {
      params: {
        ...params
      },
      timeout: 30000
    });
    return result.data;
  } catch (error) {
    console.log("error!!");
    alert("情報を取得できませんでした。\nもう一度お試しください。");
    throw new Error("情報を取得できませんでした。\nもう一度お試しください。");
  }
};
