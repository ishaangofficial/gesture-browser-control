import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { Check, CreditCard, Smartphone, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Pricing = () => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });
  const [upiId, setUpiId] = useState("");

  const plans = [
    {
      name: "Monthly",
      price: "$9",
      period: "month",
      value: "monthly",
      savings: null,
      features: [
        "Unlimited gesture control",
        "All gesture types",
        "OBS Studio integration",
        "Priority support",
        "Regular updates",
        "Desktop app access"
      ]
    },
    {
      name: "Yearly",
      price: "$89",
      period: "year",
      value: "yearly",
      savings: "Save $19",
      features: [
        "Everything in Monthly",
        "2 months free",
        "Lifetime updates",
        "Premium support",
        "Early access to features",
        "Custom gesture creation"
      ]
    }
  ];

  const handlePayment = async () => {
    if (paymentMethod === "card") {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        toast({
          title: "Missing information",
          description: "Please fill in all card details",
          variant: "destructive"
        });
        return;
      }
    } else {
      if (!upiId) {
        toast({
          title: "Missing information",
          description: "Please enter your UPI ID",
          variant: "destructive"
        });
        return;
      }
    }

    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      toast({
        title: "Payment Successful! 🎉",
        description: "Your subscription is now active. Check your email for the desktop app download link.",
      });
      setShowPayment(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto section-spacing">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="clay mb-4">Pricing</Badge>
          <h1 className="text-5xl font-bold mb-4">
            Choose Your <span className="text-gradient">Plan</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get full access to gesture control for OBS Studio. Download the desktop app after purchase.
          </p>
        </div>

        {!showPayment ? (
          <>
            {/* Plan Toggle */}
            <div className="flex justify-center mb-12">
              <div className="clay p-2 inline-flex gap-2">
                <button
                  onClick={() => setSelectedPlan("monthly")}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    selectedPlan === "monthly"
                      ? "clay text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedPlan("yearly")}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    selectedPlan === "yearly"
                      ? "clay text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Yearly
                  <Badge className="ml-2 bg-primary text-primary-foreground">Save 17%</Badge>
                </button>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans.map((plan) => (
                <Card
                  key={plan.value}
                  className={`clay clay-hover p-8 ${
                    plan.value === selectedPlan ? "clay-glow ring-2 ring-primary" : ""
                  }`}
                >
                  {plan.savings && (
                    <Badge className="mb-4 bg-primary text-primary-foreground">
                      {plan.savings}
                    </Badge>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gradient">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  
                  <Button
                    onClick={() => {
                      setSelectedPlan(plan.value as "monthly" | "yearly");
                      setShowPayment(true);
                    }}
                    className="w-full mb-6 clay clay-hover"
                    size="lg"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="clay rounded-full p-1 mt-0.5">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          /* Payment Form */
          <Card className="clay max-w-2xl mx-auto p-8">
            <h2 className="text-3xl font-bold mb-2">Complete Payment</h2>
            <p className="text-muted-foreground mb-6">
              Selected: {selectedPlan === "monthly" ? "Monthly - $9/month" : "Yearly - $89/year"}
            </p>

            {/* Payment Method Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`clay clay-hover p-4 flex items-center gap-3 ${
                  paymentMethod === "card" ? "ring-2 ring-primary" : ""
                }`}
              >
                <CreditCard className="w-5 h-5 text-primary" />
                <span className="font-medium">Credit/Debit Card</span>
              </button>
              <button
                onClick={() => setPaymentMethod("upi")}
                className={`clay clay-hover p-4 flex items-center gap-3 ${
                  paymentMethod === "upi" ? "ring-2 ring-primary" : ""
                }`}
              >
                <Smartphone className="w-5 h-5 text-primary" />
                <span className="font-medium">UPI</span>
              </button>
            </div>

            {/* Payment Forms */}
            {paymentMethod === "card" ? (
              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    maxLength={19}
                    className="clay-inset"
                  />
                </div>
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                    className="clay-inset"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      maxLength={5}
                      className="clay-inset"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      maxLength={4}
                      className="clay-inset"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="clay-inset"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowPayment(false)}
                className="flex-1 clay"
                disabled={processing}
              >
                Back
              </Button>
              <Button
                onClick={handlePayment}
                className="flex-1 clay clay-hover"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay {selectedPlan === "monthly" ? "$9" : "$89"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes, you can cancel your subscription at any time. No questions asked."
              },
              {
                q: "Is there a free trial?",
                a: "Try the browser simulation for free. Full desktop app requires a subscription."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit/debit cards and UPI payments."
              },
              {
                q: "Do I get updates?",
                a: "Yes! All plans include regular updates with new features and improvements."
              }
            ].map((faq, idx) => (
              <Card key={idx} className="clay clay-hover p-6">
                <h3 className="font-semibold mb-2 text-primary">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
