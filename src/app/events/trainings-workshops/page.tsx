import { pageMetadata } from "../../../config/seo";
import type { Metadata } from "next";
import TrainingsWorkshopsPage from "../../../components/aeetds/events/training";
export const metadata: Metadata = pageMetadata(
  "/events/trainings-workshops",
  "Trainings & Workshops | AEETDS",
  "Explore the Society's nine training areas and contact the Secretary to discuss hosting a programme.",
);
export default function TrainingRoute() {
  return <TrainingsWorkshopsPage />;
}
