export function Header({ project, page }: { project: string; page: string }) {
  return (
    <div
      tw="flex-shrink-0 flex w-full px-8 py-2 text-6xl leading-normal"
      style={{ fontFamily: "Agrandir" }}
    >
      <span
        style={{
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
      >
        {project}
      </span>
      <span tw="mx-4">&rsaquo;</span>
      <span tw="flex-shrink-0">{page}</span>
    </div>
  );
}
