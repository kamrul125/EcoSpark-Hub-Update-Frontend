import Link from "next/link";

export default function IdeaCard({ idea }: { idea: any }) {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <h2 className="font-bold text-lg">{idea.title}</h2>
      <p className="text-gray-600">{idea.description.slice(0, 100)}...</p>
      <p className="text-sm mt-2">Category: {idea.category}</p>
      <Link href={`/ideas/${idea.id}`} className="text-green-600 mt-2 inline-block">View Idea</Link>
    </div>
  );
}