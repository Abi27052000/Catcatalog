import { ChevronRight } from "lucide-react";
import Head from "next/head";
import Link from "next/link";


interface CatBreed {
  id: string;
  name: string;
}

const fetchBreeds = async (): Promise<CatBreed[]> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_CAT_API_KEY as string;
    const response = await fetch("https://api.thecatapi.com/v1/breeds?limit=20", {
      headers: {
        "x-api-key": apiKey,
      },
      cache: "no-store", 
    });

    if (!response.ok) {
      throw new Error(`Error occurred`);
    }

    const data = await response.json();
    return data.map((breed: any) => ({
      id: breed.id,
      name: breed.name,
    }));
  } catch (error) {
    console.error("Error fetching cat breeds:", error);
    return [];
  }
};

export default async function Home() {
  const breeds = await fetchBreeds();

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Cat Catalog</title>
        <meta name="description" content="A catalog of cat breeds" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-md mx-auto bg-white p-4">
        <h1 className="text-xl font-bold text-center mb-4">Cat Catalog</h1>

        <div className="space-y-1">
          {breeds.map((breed) => (
            <Link href={`/CatList/${breed.id}`} key={breed.id} className="block">
              <div className="flex items-center justify-between p-3 border border-gray-300 bg-gray-100 hover:bg-gray-200">
                <span>{breed.name}</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
