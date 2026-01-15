type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export default function PageHeader({
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <div className="m-4 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-gray-600">{description}</p>}
      </div>

      {children && <div>{children}</div>}
    </div>
  );
}
