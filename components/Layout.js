import React, { Fragment } from "react"; // Fragment: similar to div to grp a list of childrens but does not add extra nodes to the DOM
import Head from "next/head";

const Layout = props => (
  <Fragment>
    <Head>
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
        crossOrigin="anonymous"
      />
      <title>{props.pageTitle || "Realtime Chat"}</title>
    </Head>
    {props.children}
  </Fragment>
);

export default Layout;
