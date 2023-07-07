import { PoLookupColumn, PoLookupFilter } from "@po-ui/ng-components";

export interface IGPSZoom extends PoLookupFilter{
    FIELD_LABEL: string;
    FIELD_VALUE: string;
    COLUMNS:Array<PoLookupColumn>; 
    fieldFormat:Function;
}