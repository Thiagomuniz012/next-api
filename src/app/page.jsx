import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>API com Next.js</h1>
      <p>Acesse aqui a API de Pessoas:</p>
      <button><Link href="/pessoa">Pessoa</Link></button>
    </div>
  );
}
