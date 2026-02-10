import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import Home from "@/pages/Home/Home";
import Cas9 from "@/pages/Design/Cas9";
import Cas9Result from "@/pages/Design/Cas9/result";
import Cas12C2c1 from "@/pages/Design/Cas12/Cas12C2c1";
import Cas12Cpf1 from "@/pages/Design/Cas12/Cas12Cpf1";
import Cas12Result from "@/pages/Design/Cas12/Cas12Result";
import Cas13 from "@/pages/Design/Cas13";
import BaseEditor from "@/pages/Design/BaseEditor";
import BaseEditorResult from "@/pages/Design/BaseEditor/result";
import PrimerEditor from "@/pages/Design/PrimerEditor";
import CRISPRa from "@/pages/Design/CRISPRa";
import CRISPRaResult from "@/pages/Design/CRISPRa/result";
import CRISPRKnockin from "@/pages/Design/CRISPRKnockin";
import CRISPRKnockinResult from "@/pages/Design/CRISPRKnockin/result";
import CRISPREpigenome from "@/pages/Design/CRISPREpigenome";
import CRISPREpigenomeResult from "@/pages/Design/CRISPREpigenome/result";
import Deletion from "@/pages/Design/FragmentEditor/Deletion";
import Inversion from "@/pages/Design/FragmentEditor/Inversion";
import Translocation from "@/pages/Design/FragmentEditor/Translocation";
import Barcode from "@/pages/Design/EditedAnalysis/Barcode";
import EditingAnalysis from "@/pages/Design/EditedAnalysis/EditingAnalysis";
import EditingAnalysisResult from "@/pages/Design/EditedAnalysis/result/EditingAnalysisResult";
import Off_Target from "@/pages/Design/EditedAnalysis/Off_Target";
import PlasmidsList from "@/pages/Design/Protocol/PlasmidsList";
import GetPlasmids from "@/pages/Design/Protocol/GetPlasmids";
import ChatCRISPR from "@/pages/Design/ChatCRISPR/index.jsx";
import ContactUs from "@/pages/About/ContactUs";
import Help from "@/pages/About/Help";
import News from "@/pages/About/News";
import NotFound from "@/pages/NotFound/NotFound";
import ISCB from "../pages/Design/IscB";
import IscBResult from "../pages/Design/IscB/result";
import FanZor from "../pages/Design/FanZor";
import FanZorResult from "../pages/Design/FanZor/result";
import TnpB from "../pages/Design/TnpB";
import TnpBResult from "../pages/Design/TnpB/result";


// 路由配置
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "cas9",
        element: <Cas9 />,
      },
      {
        path: "cas9/result",
        element: <Cas9Result />,
      },
      {
        path: "cas12",
        children: [
          {
            path: "cpf1",
            element: <Cas12Cpf1 />,
          },
          {
            path: "c2c1",
            element: <Cas12C2c1 />,
          },
          {
            path: "result",
            element: <Cas12Result />,
          },
        ],
      },
      {
        path: "cas13",
        element: <Cas13 />,
      },
      {
        path: "IscB",
        element: <ISCB />,
      },
      {
        path: "IscB/result",
        element: <IscBResult />,
      },
      {
        path: "TnpB",
        element: <TnpB />,
      },
      {
        path: "TnpB/result",
        element: <TnpBResult />,
      },
      {
        path: "base-editor",
        element: <BaseEditor />,
      },
      {
        path: "baseEditor/result",
        element: <BaseEditorResult />,
      },
      {
        path: "FanZor",
        element: <FanZor />,
      },
      {
        path: "FanZor/result",
        element: <FanZorResult />,
      },
      {
        path: "primer-editor",
        element: <PrimerEditor />,
      },
      {
        path: "crispra",
        element: <CRISPRa />,
      },
      {
        path: "crispra/result",
        element: <CRISPRaResult />,
      },
      {
        path: "crispr-knockin",
        element: <CRISPRKnockin />,
      },
      {
        path: "crispr-knockin/result",
        element: <CRISPRKnockinResult />,
      },
      {
        path: "crispr-epigenome",
        element: <CRISPREpigenome />,
      },
      {
        path: "crispr-epigenome/result",
        element: <CRISPREpigenomeResult />,
      },
      {
        path: "fragment-editor",
        children: [
          { path: "deletion", element: <Deletion /> },
          { path: "inversion", element: <Inversion /> },
          { path: "translocation", element: <Translocation /> },
        ],
      },
      {
        path: "edited-analysis",
        children: [
          { path: "barcode", element: <Barcode /> },
          { path: "editing-analysis", element: <EditingAnalysis /> },
          { path: "editing-analysis/result", element: <EditingAnalysisResult /> },
          { path: "off-target", element: <Off_Target /> },
        ],
      },
      {
        path: "protocol",
        children: [
          { path: "plasmids-list", element: <PlasmidsList /> },
          { path: "get-plasmids", element: <GetPlasmids /> },
        ],
      },
      {
        path: "chat-crispr",
        element: <ChatCRISPR />,
      },
      {
        path: "help-about",
        children: [
          { path: "help", element: <Help /> },
          { path: "news", element: <News /> },
          { path: "contact-us", element: <ContactUs /> },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      }
    ],
  },
]);

export default router;
