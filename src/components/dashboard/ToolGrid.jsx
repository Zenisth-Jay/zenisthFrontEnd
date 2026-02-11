import ToolCard from "./ToolCard";

const ToolGrid = ({ tools }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {tools.map((tool, index) => (
        <ToolCard key={tool.id ?? `${tool.title}-${index}`} tool={tool} />
      ))}
    </div>
  );
};

export default ToolGrid;
