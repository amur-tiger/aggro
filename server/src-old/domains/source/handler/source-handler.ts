import { ScanContext } from "./scan-context";
import { SourceLink } from "./source-link";

export interface SourceHandler {
  scanForSource(context: ScanContext): Promise<SourceLink[]>;
}
