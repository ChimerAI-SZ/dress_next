"use client";

import { Container } from "@chakra-ui/react";
import Header from "./components/Header";
import TypesClothing from "./components/TypesClothing";
import UploadImage from "./components/UploadImage";
function Page() {
  return (
    <Container p={3} bg={"#f5f5f5"} h={"100vh"}>
      <Header></Header>
      <TypesClothing></TypesClothing>
      <UploadImage></UploadImage>
    </Container>
  );
}

export default Page;
