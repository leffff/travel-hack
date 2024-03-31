export const UserHeader = (x: { title: string; body: string }) => {
  return (
    <section className="flex flex-col section gap-6 pt-8 pb-14">
      <h1 className="text-white font-grotesk text-5xl">{x.title}</h1>
      <p className="whitespace-pre text-white text-wrap max-w-3xl">{x.body}</p>
    </section>
  );
};
