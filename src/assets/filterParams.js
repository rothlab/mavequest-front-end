export default {
    availAssays: [
        "mavedb",
        "genome_crispr",
        "genome_rnai",
        "orthology",
        "overexpression",
        "huri",
    ],
    availPhenotypes: [
        "clinvar",
        "omim",
        "cancer_census",
        "orphanet",
    ],
    availClinicalInterests: [
        "ambry",
        "invitae",
        "genedx"
    ],
    formatTag(tag) {
        switch (tag) {
            case "mavedb":
                return "MaveDB";
            case "genome_rnai":
                return "RNAi";
            case "genome_crispr":
                return "CRISPR KO";
            case "huri":
                return "Interactome";
            case "overexpression":
                return "Over Expression";
            case "omim":
                return "OMIM";
            case "cancer_census":
                return "Cancer Census";
            case "genedx":
                return "GeneDx";
            default:
                return tag;
        }
    }
}