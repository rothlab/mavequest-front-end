export default {
    availAssays: [
        "genome_crispr",
        "genome_rnai",
        "orthology",
        "overexpression",
        "huri"
    ],
    availPhenotypes: [
        "clinvar",
        "omim",
        "cancer_census",
        "orphanet",
        "invitae"
    ],
    formatTag(tag) {
        switch (tag) {
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
            default:
                return tag;
        }
    }
}