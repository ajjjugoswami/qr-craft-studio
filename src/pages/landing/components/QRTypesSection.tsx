import { Card } from "@/components/ui/card";
import {
  QrCode,
  Link as LinkIcon,
  Phone,
  Mail,
  MessageSquare,
  Wifi,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  CreditCard,
  FileText,
  Crown,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import AnimatedSection from "./AnimatedSection";
import MobileCarousel from "./MobileCarousel";

const qrTypes = [
  { icon: <LinkIcon className="h-4 w-4" />, label: "URL", free: true },
  { icon: <Phone className="h-4 w-4" />, label: "Phone", free: true },
  { icon: <Mail className="h-4 w-4" />, label: "Email", free: true },
  { icon: <MessageSquare className="h-4 w-4" />, label: "SMS", free: true },
  { icon: <Wifi className="h-4 w-4" />, label: "WiFi", free: false },
  { icon: <MapPin className="h-4 w-4" />, label: "Location", free: false },
  { icon: <Instagram className="h-4 w-4" />, label: "Instagram", free: false },
  { icon: <Facebook className="h-4 w-4" />, label: "Facebook", free: false },
  { icon: <Youtube className="h-4 w-4" />, label: "YouTube", free: false },
  { icon: <MessageCircle className="h-4 w-4" />, label: "WhatsApp", free: false },
  { icon: <CreditCard className="h-4 w-4" />, label: "vCard", free: false },
  { icon: <FileText className="h-4 w-4" />, label: "Text", free: false },
];

const QRTypeCard = ({ type }: { type: typeof qrTypes[0] }) => (
  <Card
    className={`p-3 text-center relative transition-all duration-200 h-full ${
      type.free
        ? "hover:border-primary/50 hover:shadow-sm cursor-pointer"
        : "bg-muted/30 opacity-75"
    }`}
  >
    {!type.free && (
      <div className="absolute -top-1 -right-1 bg-foreground text-background h-4 w-4 rounded-full flex items-center justify-center">
        <Crown className="h-2 w-2" />
      </div>
    )}
    <div
      className={`h-8 w-8 rounded-lg flex items-center justify-center mx-auto mb-1.5 ${
        type.free
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {type.icon}
    </div>
    <span className="text-[10px] font-medium">{type.label}</span>
  </Card>
);

const QRTypesSection = () => {
  const isMobile = useIsMobile();

  return (
    <section className="py-10 md:py-12 lg:py-16 bg-muted/20 border-y border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-1.5 bg-muted text-foreground/70 px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
              <QrCode className="h-3 w-3" />
              <span>12 QR Code Types</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">
              One Tool, Endless Possibilities
            </h2>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto">
              Create QR codes for websites, contact cards, WiFi networks,
              social media, and more.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={150}>
          {isMobile ? (
            <MobileCarousel itemClassName="basis-1/3 min-w-[90px]">
              {qrTypes.map((type, index) => (
                <QRTypeCard key={index} type={type} />
              ))}
            </MobileCarousel>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 max-w-3xl mx-auto">
              {qrTypes.map((type, index) => (
                <QRTypeCard key={index} type={type} />
              ))}
            </div>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
};

export default QRTypesSection;
