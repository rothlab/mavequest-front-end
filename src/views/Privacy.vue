<template>
  <div class="privacy">
    <!-- Header -->
    <Header title="Privacy Policy"></Header>

    <section class="section fill-screen-withheader">
      <div class="container is-centered is-flex">
        <div class="content privacy">
          <h1 class="title is-hidden-tablet">Privacy Policy</h1>
          <h2 class="subtitle is-4">Last updated: July 29, 2019</h2>
          <p>
            Your privacy is important to MaveQuest ("we", "us", or "ours"). 
            It is our policy to respect your privacy regarding any information 
            we may collect from you across our Service, 
            https://mavequest.varianteffect.org.
          </p>

          <h1 class="title is-5">Information we collect</h1>
          <p>
            We only ask for personal information when we truly need it to 
            provide a service to you. We collect it by fair and lawful means, 
            with your knowledge and consent. We also let you know why we’re 
            collecting it and how it will be used.
          </p>
          <h1 class="title is-6">Information automatically collected </h1>
          <b-message type="is-info" has-icon>
            <i>In Short:</i> Some information – such as IP address and/or 
            browser and device characteristics – is collected automatically when 
            you visit our Services.
          </b-message>
          <p>
            We automatically collect certain information when you visit, use 
            or navigate the Services. This information does not reveal your 
            specific identity (like your name or contact information) but may 
            include device and usage information, such as your IP address, 
            browser and device characteristics, operating system, language 
            preferences, referring URLs, device name, country, location, 
            information about how and when you use our Services and other 
            technical information. This information is primarily needed to 
            maintain the security and operation of our Services, and for our 
            internal analytics and reporting purposes.
          </p>

          <h1 class="title is-5">Information we retain</h1>
          <b-message type="is-info" has-icon>
            <i>In Short:</i>  We keep your information for as long as necessary 
            to fulfill the purposes outlined in this privacy notice unless 
            otherwise required by law.   
          </b-message>
          <p>
            We only retain collected information for as long as necessary to 
            provide you with your requested service, unless a longer retention 
            period is required or permitted by law (such as tax, accounting or 
            other legal requirements). No purpose in this policy will require us 
            keeping your personal information for longer than 1 year.
            What data we store, we’ll protect within commercially acceptable 
            means to prevent loss and theft, as well as unauthorised access, 
            disclosure, copying, use or modification.
          </p>

          <h1 class="title is-5">Information we share</h1>
          <b-message type="is-info" has-icon>
            <i>In Short:</i>  We only share information with your consent, to comply
             with laws, to provide you with services, to protect your rights, 
             or to fulfill our obligations.   
          </b-message>
          <p>
            We may process or share data based on the following legal basis:
            <ol>
              <li>
                Consent: We may process your data if you have given us specific 
                consent to use your personal information in a specific purpose. 
              </li>
              <li>
                Performance of a Contract: Where we have entered into a 
                contract with you, we may process your personal information 
                to fulfill the terms of our contract.
              </li>
              <li>
                Legal Obligations: We may disclose your information where we 
                are legally required to do so in order to comply with applicable 
                law, governmental requests, a judicial proceeding, court order, 
                or legal process, such as in response to a court order or a 
                subpoena (including in response to public authorities to meet 
                national security or law enforcement requirements). 
              </li>
            </ol>
          </p>
          <p>
            More specifically, we may need to process your data or share your 
            personal information in the following situations:
            <ol>
              <li>
                Vendors, Consultants and Other Third-Party Service Providers. 
                We may share your data with third party vendors, service 
                providers, contractors or agents who perform services for us or 
                on our behalf and require access to such information to do that 
                work. Examples include: payment processing, data analysis, 
                email delivery, hosting services, customer service and 
                marketing efforts. We may allow selected third parties to use 
                tracking technology on the Services, which will enable them to 
                collect data about how you interact with the Services over time. 
                This information may be used to, among other things, analyze 
                and track data, determine the popularity of certain content 
                and better understand online activity. Unless described in this 
                Policy, we do not share, sell, rent or trade any of your 
                information with third parties for their promotional purposes.   
              </li>
            </ol>
          </p>

          <h1 class="title is-5">Updates to this policy</h1>
          <b-message type="is-info" has-icon>
            <i>In Short:</i>  Yes, we will update this policy as necessary to 
            stay compliant with relevant laws.  
          </b-message>
          <p>
            We may update this privacy notice from time to time. 
            The updated version will be indicated by an updated “Revised” date 
            and the updated version will be effective as soon as it is 
            accessible. If we make material changes to this privacy notice, 
            we may notify you either by prominently posting a notice of such 
            changes or by directly sending you a notification. We encourage 
            you to review this privacy notice frequently to be informed of 
            how we are protecting your information.  
          </p>

          <h1 class="title is-5">Things to keep in mind</h1>
          <p>
            Our website may link to external sites that are not operated by us. 
            Please be aware that we have no control over the content and 
            practices of these sites, and cannot accept responsibility or 
            liability for their respective privacy policies.
          </p>
          <p>
            Your continued use of our website will be regarded as acceptance 
            of our practices around privacy and personal information. 
            If you have any questions about how we handle user data and 
            personal information, feel free to 
            <a href="/about#contact-us">contact us</a>.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Header from "@/components/Header.vue"

export default {
  name: "privacy",
  components: {
    Header
  },
  mounted() {
    // Update highlighted navbar item
    this.$emit("updateNav", "privacy");
  }
};
</script>

<style scoped>
.is-centered {
  justify-content: center;
}
.container > .privacy {
  width: 80%;
  min-width: 50vw;
}
</style>