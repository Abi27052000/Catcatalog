"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Head from "next/head";
import Link from "next/link";

interface CatBreedDetail {
  id: string;
  name: string;
  origin: string;
  life_span: string;
  description: string;
  image?: { url: string };
}

const fetchBreedDetails = async (id: string): Promise<CatBreedDetail | null> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_CAT_API_KEY as string;
      
    const response = await fetch(`https://api.thecatapi.com/v1/breeds/${id}`, {
      headers: { "x-api-key": apiKey },
    });

    if (!response.ok) throw new Error(`Failed to fetch breed details: ${response.status}`);

    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      origin: data.origin,
      life_span: data.life_span,
      description: data.description,
      image: data.reference_image_id ? { url: `https://cdn2.thecatapi.com/images/${data.reference_image_id}.jpg` } : undefined,
    };
  } catch (error) {
    console.error("Error fetching cat breed details:", error);
    return null;
  }
};

export default function CatDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [breed, setBreed] = useState<CatBreedDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBreedDetails(id).then((data) => {
        setBreed(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!breed) return <div className="min-h-screen flex items-center justify-center text-red-500">Failed to load breed details.</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{breed.name} - Cat Details</title>
        <meta name="description" content={`Details of ${breed.name}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-md mx-auto bg-white p-4">
        <Link href="/CatList" className="flex items-center text-blue-500 mb-4">
          <ChevronLeft className="h-5 w-5" />
          <span className="ml-2">Back</span>
        </Link>

        <h1 className="text-2xl font-bold text-center">{breed.name}</h1>

        {breed.image?.url && (
          <div className="flex justify-center mt-4">
            <img src={breed.image.url} alt={breed.name} className="w-64 h-64 object-cover rounded-lg shadow-lg" />
          </div>
        )}

        <div className="mt-4 space-y-2">
          <p><span className="font-semibold">Origin:</span> {breed.origin}</p>
          <p><span className="font-semibold">Life Span:</span> {breed.life_span} years</p>
          <p className="mt-2">{breed.description}</p>
        </div>
      </main>
    </div>
  );
}
