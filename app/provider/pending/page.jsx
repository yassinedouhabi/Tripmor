export default function ProviderPendingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Account Pending Approval
        </h1>
        <p className="text-gray-600 mb-6">
          Your provider account is currently under review. We typically approve
          accounts within 24–48 hours. You will receive an email once your
          account is approved.
        </p>
        <p className="text-sm text-gray-500">
          Questions?{" "}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            className="text-teal-600 hover:underline font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact us on WhatsApp
          </a>
        </p>
      </div>
    </main>
  );
}
