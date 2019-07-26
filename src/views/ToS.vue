<template>
  <div class="tos">
    <!-- Header -->
    <Header title="Terms and Conditions"></Header>

    <section class="section fill-screen-withheader">
      <div class="container is-centered is-flex">
        <div class="content tos">
          <h1 class="title is-hidden-tablet">Terms and Conditions</h1>
          <h2 class="subtitle is-4">Last updated: July 26, 2019</h2>
          <p>
            Please read these Terms and Conditions ("Terms", "Terms and Conditions")
            carefully before using the https://mavequest.varianteffect.org/ website (the
            "Service") operated by MaveQuest ("us", "we", or "our").
          </p>
          <p>
            Your access to and use of the Service is conditioned on your 
            acceptance of andcompliance with these Terms. These Terms apply to 
            all visitors, users and others who access or use the Service.
          </p>
          <p>
            By accessing or using the Service you agree to be bound by these Terms. 
            If you disagree with any part of the terms then you may not access the Service.
          </p>

          <h1 class="title is-5">Acceptable Use</h1>
          <p>
            You may not access or use the Service for any purpose other than 
            that for which we make the Service available. 
            As a user of this Service, you agree not to:
            <ol type="1">
              <li>
                Circumvent, disable, or otherwise interfere with security-related 
                features of the Service, including features that prevent or restrict 
                the use or copying of any content or enforce limitations on the use
              </li>
              <li>
                Systematically retrieve data or other content from the Service to 
                a compile database or directory without written permission from us 
              </li>
              <li>
                Interfere with, disrupt, or create an undue burden on the Service 
                or the networks and services connected to the Service  
              </li>
              <li>
                Use any information obtained from the Service in order to harass, 
                abuse, or harm another person  
              </li>
              <li>
                Delete the copyright or other proprietary rights notice from any of the content
              </li>
              <li>
                Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Service
              </li>
              <li>
                Use the Service in a manner inconsistent with any applicable laws or regulations
              </li>
            </ol>
          </p>

          <h1 class="title is-5">Links To Other Web Sites</h1>
          <p>
            Our Service may contain links to third-party web sites or services 
            that are not owned or controlled by MaveQuest.
          </p>
          <p>
            MaveQuest has no control over, and assumes no responsibility for, 
            the content, privacy policies, or practices of any third party web 
            sites or services. You further acknowledge and agree that MaveQuest 
            shall not be responsible or liable, directly or indirectly, 
            for any damage or loss caused or alleged to be caused by or in 
            connection with use of or reliance on any such content, goods or 
            services available on or through any such web sites or services.
          </p>
          <p>
            We strongly advise you to read the terms and conditions and privacy 
            policies of any third-party web sites or services that you visit.
          </p>

          <h1 class="title is-5">Termination</h1>
          <p>
            We may terminate or suspend access to our Service immediately, 
            without prior notice or liability, for any reason whatsoever, 
            including without limitation if you breach the Terms.
          </p>
          <p>
            All provisions of the Terms which by their nature should survive 
            termination shall survive termination, including, without limitation, 
            ownership provisions, warranty disclaimers, 
            indemnity and limitations of liability.
          </p>

          <h1 class="title is-5">Disclaimer of warranties</h1>
          <p>
            Our Service are provided “as is.” We and our suppliers, licensors 
            and associated parties hereby disclaim all warranties of any kind, 
            express or implied, including, without limitation, the warranties 
            of merchantability, fitness for a particular purpose and 
            non-infringement. Neither we, nor our suppliers, licensors and 
            associated parties makes any warranty that our Service will be 
            error free or that access thereto will be continuous or uninterrupted. 
            You understand that you download from, or otherwise obtain content 
            or services through, our Service at your own discretion and risk.
          </p>

          <h1 class="title is-5">Limitation of Liability</h1>
          <p>
            In no event will us, or its suppliers, licensors or 
            associated parties, be liable with respect to any subject matter 
            of the Agreement under any contract, negligence, strict liability 
            or other legal or equitable theory for: 
            <ol type="1">
              <li>any special, incidental or consequential damages</li>
              <li>the cost of procurement for substitute products or services</li>
              <li>for interruption of use or loss or corruption of data</li>
            </ol>
          </p>
          <p>
            The foregoing shall not apply to the extent prohibited by applicable law.
          </p>

          <h1 class="title is-5">Governing Law</h1>
          <p>
            These Terms shall be governed and construed in accordance with the 
            laws of Ontario, Canada, without regard to its conflict of law provisions.
          </p>
          <p>
            Our failure to enforce any right or provision of these Terms will 
            not beconsidered a waiver of those rights. If any provision of 
            these Terms is held to be invalid or unenforceable by a court, 
            the remaining provisions of these Terms will remain in effect. 
            These Terms constitute the entire agreement between us regarding 
            our Service, and supersede and replace any prior agreements we 
            might have between us regarding the Service.
          </p>

          <h1 class="title is-5">Changes</h1>
          <p>
            We reserve the right, at our sole discretion, to modify or replace 
            these Terms at any time. If a revision is material we will try to 
            provide at least 30 days notice prior to any new terms taking effect. 
            What constitutes a material change will be determined at our sole discretion.
          </p>
          <p>
            By continuing to access or use our Service after those revisions 
            become effective, you agree to be bound by the revised terms.
             If you do not agree to the new terms, please stop using the Service.
          </p>

          <h1 class="title is-5">Contact Us</h1>
          If you have any questions about these Terms, please 
          <a href="/about#contact-us">contact us</a>.
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Header from "@/components/Header.vue"

export default {
  name: "tos",
  components: {
    Header
  },
  mounted() {
    // Update highlighted navbar item
    this.$emit("updateNav", "tos");
  }
};
</script>

<style scoped>
.is-centered {
  justify-content: center;
}
.container > .tos {
  width: 80%;
  min-width: 50vw;
}
</style>
