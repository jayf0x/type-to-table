// A Next.js page component. Next's `NextPage<Props>` type is a thin, optional
// wrapper — the props/JSDoc shape below is identical with or without it, and
// skipping it here keeps this fixture installable without the `next` package.
export type HomeProps = {
  /** Page title. @default 'Home' */
  title?: string;
};

const Home = ({ title }: HomeProps) => title;

export default Home;
