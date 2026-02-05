import React from "react";
import Layout from "@/components/Layout/Layout";
import {
  PrimaryHeading,
  PrimarySubHeading,
  SectionGap,
  Container,
  Flex,
  ButtonPrimary,
  PrimaryText,
} from "@/components/reusables";

const Home = () => {
  return (
    <Layout>
      <Container className="py-20">
        <Flex className="flex-col items-center text-center max-w-4xl mx-auto">
          <PrimaryHeading className="mb-6">
            Build Something <span className="text-button">Extraordinary</span>
          </PrimaryHeading>
          <PrimarySubHeading className="mb-8">
            Welcome to your new premium Next.js starter template. Clean,
            modular, and ready for any project.
          </PrimarySubHeading>
          <Flex className="gap-4">
            <ButtonPrimary>Get Started</ButtonPrimary>
            <button className="px-8 py-3 border border-primaryText rounded-full hover:bg-primaryText hover:text-white transition-all">
              View Documentation
            </button>
          </Flex>
        </Flex>

        <SectionGap />

        <Flex className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="p-8 bg-white shadow-sm rounded-2xl border border-borderBg border-opacity-50">
            <h3 className="text-xl font-bold mb-4 font-secondary">
              Next.js 15 Ready
            </h3>
            <PrimaryText>
              Leverage the latest App Router features, Server Components, and
              optimized performance.
            </PrimaryText>
          </div>
          <div className="p-8 bg-white shadow-sm rounded-2xl border border-borderBg border-opacity-50">
            <h3 className="text-xl font-bold mb-4 font-secondary">
              Tailwind 4 Powered
            </h3>
            <PrimaryText>
              Experience the future of styling with Tailwind CSS v4's
              high-performance engine.
            </PrimaryText>
          </div>
          <div className="p-8 bg-white shadow-sm rounded-2xl border border-borderBg border-opacity-50">
            <h3 className="text-xl font-bold mb-4 font-secondary">
              Redux Toolkit
            </h3>
            <PrimaryText>
              Pre-configured state management with RTK Query for efficient data
              fetching and caching.
            </PrimaryText>
          </div>
        </Flex>
      </Container>

      <SectionGap />
    </Layout>
  );
};

export default Home;
