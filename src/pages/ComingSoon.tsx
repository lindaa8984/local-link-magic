import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

interface ComingSoonProps {
  moduleName: string;
}

export default function ComingSoon({ moduleName }: ComingSoonProps) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-6 w-6 text-primary" />
            {t(`nav.${moduleName}`)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            This module is under development and will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
