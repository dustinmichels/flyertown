import "dotenv/config"; // Ensure Bun loads the .env file
import PocketBase from "pocketbase";

interface RecordItem {
  id: string;
  [key: string]: any;
}

interface RecordList {
  items: RecordItem[];
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}

async function fetchFlyers(): Promise<void> {
  const pb = new PocketBase("http://127.0.0.1:8090");

  try {
    // Authenticate using environment variables
    const email = process.env.POCKETBASE_EMAIL as string;
    const password = process.env.POCKETBASE_PASSWORD as string;
    await pb.collection("_superusers").authWithPassword(email, password);

    const resultList: RecordList = await pb.collection("flyers").getList(1, 50);

    resultList.items.forEach((record) => {
      const imageUrl = pb.files.getURL(record, record.image);
      console.log({
        ...record,
        imageUrl,
      });
    });
  } catch (error) {
    console.error("Error fetching records:", error);
  }
}

fetchFlyers();
