import { ButtonLink } from "@/components/button";
import { NetworkCards } from "@/components/network-cards";
import { NETWORK_NAME } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow rise mb-3">404</p>
        <h1 className="display rise rise-2 text-5xl sm:text-6xl">
          That page does not <span className="marker">exist.</span>
        </h1>
        <p className="rise rise-3 mt-5 text-lg text-muted">The link may be old, or the page moved. The home page has everything.</p>
        <div className="rise rise-4 mt-8 flex justify-center gap-3">
          <ButtonLink href="/" size="lg">
            Home
          </ButtonLink>
          <ButtonLink href="/store" variant="secondary" size="lg">
            Store
          </ButtonLink>
        </div>
      </div>
      <div className="mt-20">
        <p className="eyebrow mb-6">Looking for another {NETWORK_NAME} server?</p>
        <NetworkCards />
      </div>
    </div>
  );
}
