import { Beneficiary } from "totvs-gps-api-v2";
import { KinshipDegree } from "totvs-gps-api";

export class BeneficiaryZoomModel extends Beneficiary {
    $taxpayerRegistry:string;
    $kinshipDegree:KinshipDegree;

    get $kinshipDegreeDescription() {
        if (this.$kinshipDegree)
            return `${this.$kinshipDegree.code} - ${this.$kinshipDegree.description}`;
        return '';
    }
}