interface ButtonPromptArgs {
  intent: 'trade' | 'learn';
  userLevel: 'beginner' | 'intermediate' | 'pro';
}

export default function PersonalizedButton({ intent }: { intent: string }) {
  const { data: session } = useSession();
  const [ctaText, setCta] = useState('Start Trading');

  useEffect(() => {
    fetch(`/api/generate-cta?intent=${intent}&level=${session?.user?.tier || 'beginner'}`)
      .then(res => res.json())
      .then(({ text }) => setCta(text));
  }, [intent]);

  return (
    <button 
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform"
      onClick={() => trackCTAConversion(intent)}
    >
      {ctaText} 
    </button>
  );
}
