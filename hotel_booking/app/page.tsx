import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  console.log(process.env.NEXT_PUBLIC_API_URL);
  return (
    <>
      <Header />

      {/* <main>
        <h1>Welcome to Crestview Hotel</h1>
        <p>
          We are a hotel located in the heart of the city. We offer the best
          services and amenities to our guests.
        </p>

        <section>
          <h2>Our Services</h2>
          <ul>
            <li>Free Wi-Fi</li>
            <li>Swimming Pool</li>
            <li>Restaurant</li>
            <li>Bar</li>
          </ul>
        </section> */}
      {/* </main> */}

      <main>
        <div className="flex flex-col items-center justify-center h-screen">
          <Image
            src="/logo.png"
            alt="Crestview Hotel"
            width={100}
            height={100}
          />
          <h1 className="text-4xl font-bold  mt-4">Crestview Hotel</h1>
          <p className="text-lg text-center text-white/40 mt-2">
            We offer the best services and amenities to our guests.
          </p>

          <Link
            href="/auth/login"
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Let's Chat
          </Link>
        </div>
      </main>
    </>
  );
}
