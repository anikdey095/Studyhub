interface NoteCardProps {
  title: string;
  content: string;
}

const NoteCard = ({ title, content }: NoteCardProps) => {
  return (
    <div className="bg-[#0f0f15] p-4 rounded-lg">
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{content}</p>
    </div>
  );
};

export default NoteCard;