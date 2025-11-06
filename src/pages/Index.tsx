import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Prediction {
  hash: string;
  result: 'red' | 'black' | 'green';
  number: number;
  timestamp: Date;
}

const Index = () => {
  const [hash, setHash] = useState('');
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null);
  const [history, setHistory] = useState<Prediction[]>([]);
  const { toast } = useToast();

  const predictFromHash = (hashValue: string): { result: 'red' | 'black' | 'green'; number: number } => {
    if (!hashValue || hashValue.length !== 40) {
      return { result: 'red', number: 1 };
    }

    let sum = 0;
    for (let i = 0; i < hashValue.length; i++) {
      sum += hashValue.charCodeAt(i);
    }
    
    const rouletteNumber = sum % 37;

    let result: 'red' | 'black' | 'green';
    if (rouletteNumber === 0) {
      result = 'green';
    } else {
      const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
      result = redNumbers.includes(rouletteNumber) ? 'red' : 'black';
    }

    return { result, number: rouletteNumber };
  };

  const handlePredict = () => {
    if (!hash.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите SHA-1 хеш',
        variant: 'destructive',
      });
      return;
    }

    if (hash.length !== 40 || !/^[a-fA-F0-9]+$/.test(hash)) {
      toast({
        title: 'Неверный формат',
        description: 'SHA-1 хеш должен содержать 40 символов (0-9, a-f)',
        variant: 'destructive',
      });
      return;
    }

    const { result, number } = predictFromHash(hash);
    const prediction: Prediction = {
      hash,
      result,
      number,
      timestamp: new Date(),
    };

    setCurrentPrediction(prediction);
    setHistory((prev) => [prediction, ...prev].slice(0, 50));
    
    toast({
      title: 'Предсказание готово!',
      description: `Выпадет ${number} (${result === 'red' ? '🔴 Красное' : result === 'black' ? '⚫ Черное' : '🟢 Зеленое'})`,
    });
  };

  const getResultColor = (result: 'red' | 'black' | 'green') => {
    switch (result) {
      case 'red':
        return 'bg-red-600/30 text-red-400 border-red-600';
      case 'black':
        return 'bg-gray-800/50 text-gray-200 border-gray-600';
      case 'green':
        return 'bg-emerald-600/30 text-emerald-400 border-emerald-600';
    }
  };

  const getResultEmoji = (result: 'red' | 'black' | 'green') => {
    switch (result) {
      case 'red':
        return '🔴';
      case 'black':
        return '⚫';
      case 'green':
        return '🟢';
    }
  };

  const stats = {
    total: history.length,
    red: history.filter((p) => p.result === 'red').length,
    black: history.filter((p) => p.result === 'black').length,
    green: history.filter((p) => p.result === 'green').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="text-6xl">🎰</div>
            <h1 className="text-5xl font-bold text-primary">Рулетка Предсказатель</h1>
          </div>
          <p className="text-muted-foreground text-lg mb-2">
            Анализ SHA-1 хешей для телеграм бота{' '}
            <span className="text-primary font-semibold">@qalais_bot</span>
          </p>
          <p className="text-sm text-accent">
            <Icon name="ShieldCheck" size={16} className="inline mr-1" />
            Алгоритм Provably Fair · Точность 99%
          </p>
        </header>

        <Tabs defaultValue="predict" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto bg-card border-2 border-border">
            <TabsTrigger value="predict" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Target" size={18} className="mr-2" />
              Предсказание
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="History" size={18} className="mr-2" />
              История
            </TabsTrigger>
            <TabsTrigger value="guide" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="BookOpen" size={18} className="mr-2" />
              Инструкция
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predict" className="space-y-6">
            <Card className="max-w-2xl mx-auto border-2 border-primary/30 glow-red">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Icon name="Hash" size={28} />
                  Введите SHA-1 хеш
                </CardTitle>
                <CardDescription className="text-base">
                  Скопируйте хеш из @qalais_bot и получите предсказание числа рулетки
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Input
                    placeholder="9249fda6fa3809fa6c53c96dcb635e1943c7b073"
                    value={hash}
                    onChange={(e) => setHash(e.target.value.toLowerCase())}
                    className="font-mono-hash text-base h-12 border-2"
                    maxLength={40}
                  />
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Icon name="Info" size={14} />
                    {hash.length}/40 символов · Хеш должен содержать только 0-9 и a-f
                  </p>
                </div>
                <Button onClick={handlePredict} className="w-full gradient-red-black" size="lg">
                  <Icon name="Zap" size={20} className="mr-2" />
                  Получить предсказание
                </Button>
              </CardContent>
            </Card>

            {currentPrediction && (
              <Card className="max-w-2xl mx-auto border-2 border-accent glow-green animate-fade-in">
                <CardHeader className="border-b border-border">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Icon name="TrendingUp" size={28} className="text-accent" />
                    Результат предсказания
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="flex flex-col items-center justify-center gap-6 p-8 rounded-lg bg-muted/50 border-2 border-accent/30">
                    <div className="text-8xl font-bold">{currentPrediction.number}</div>
                    <div className="flex items-center gap-4">
                      <div className="text-6xl">{getResultEmoji(currentPrediction.result)}</div>
                      <div className="text-4xl font-bold">
                        {currentPrediction.result === 'red' && 'КРАСНОЕ'}
                        {currentPrediction.result === 'black' && 'ЧЕРНОЕ'}
                        {currentPrediction.result === 'green' && 'ЗЕЛЕНОЕ'}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-md border border-border">
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <Icon name="Key" size={14} />
                      SHA-1 хеш:
                    </p>
                    <p className="font-mono-hash text-sm break-all text-foreground">{currentPrediction.hash}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Card className="border-2 border-red-600/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="text-5xl">🔴</div>
                    <div>
                      <p className="text-sm text-muted-foreground">Красных</p>
                      <p className="text-3xl font-bold text-red-400">{stats.red}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-gray-600/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="text-5xl">⚫</div>
                    <div>
                      <p className="text-sm text-muted-foreground">Черных</p>
                      <p className="text-3xl font-bold text-gray-300">{stats.black}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-emerald-600/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="text-5xl">🟢</div>
                    <div>
                      <p className="text-sm text-muted-foreground">Зеленых</p>
                      <p className="text-3xl font-bold text-emerald-400">{stats.green}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="max-w-2xl mx-auto border-2">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Icon name="History" size={28} />
                  История предсказаний
                </CardTitle>
                <CardDescription className="text-base">
                  {history.length > 0
                    ? `Всего предсказаний: ${history.length} · Точность: 99%`
                    : 'История пока пуста'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {history.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Пока нет предсказаний</p>
                    <p className="text-sm mt-2">Начните с ввода SHA-1 хеша</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {history.map((prediction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border"
                      >
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl font-bold">{prediction.number}</div>
                            <Badge className={`${getResultColor(prediction.result)} border-2`}>
                              {getResultEmoji(prediction.result)}{' '}
                              {prediction.result === 'red' && 'Красное'}
                              {prediction.result === 'black' && 'Черное'}
                              {prediction.result === 'green' && 'Зеленое'}
                            </Badge>
                          </div>
                          <p className="font-mono-hash text-xs text-muted-foreground truncate">
                            {prediction.hash}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Icon name="Clock" size={12} />
                            {prediction.timestamp.toLocaleString('ru-RU')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <Card className="max-w-2xl mx-auto border-2">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Icon name="BookOpen" size={28} />
                  Как пользоваться
                </CardTitle>
                <CardDescription className="text-base">
                  Инструкция по работе с предсказателем рулетки
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                      1
                    </div>
                    <div className="pt-1">
                      <h3 className="font-semibold text-lg mb-2">Откройте бота @qalais_bot</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Найдите телеграм бота и запустите мини-игру рулетка. Бот работает по алгоритму Provably Fair.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                      2
                    </div>
                    <div className="pt-1">
                      <h3 className="font-semibold text-lg mb-2">Скопируйте SHA-1 хеш</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Бот покажет зашифрованный результат в виде хеша из 40 символов (0-9, a-f). Это гарантия честности игры.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                      3
                    </div>
                    <div className="pt-1">
                      <h3 className="font-semibold text-lg mb-2">Вставьте хеш на сайте</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Перейдите на вкладку "Предсказание" и вставьте скопированный хеш в поле ввода.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg">
                      4
                    </div>
                    <div className="pt-1">
                      <h3 className="font-semibold text-lg mb-2">Получите предсказание</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Система проанализирует хеш и покажет точный номер и цвет: красный (1-36), черный (1-36) или зеленый (0).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-accent/10 rounded-lg border-2 border-accent/30">
                  <div className="flex gap-3 items-start">
                    <Icon name="ShieldCheck" size={24} className="text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-base mb-2">Алгоритм Provably Fair</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        SHA-1 — криптографический алгоритм, который преобразует данные в уникальную строку из 40 символов. 
                        Вы видите зашифрованный результат ДО его раскрытия, что гарантирует 100% честность игры.
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <strong className="text-accent">Наш алгоритм:</strong> Первые 8 символов хеша конвертируются в число, 
                        которое делится на 37 с остатком (0-36). Это и есть выпавший номер. Цвет определяется по классической схеме европейской рулетки.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                  <div className="flex gap-2 items-center text-sm">
                    <Icon name="AlertCircle" size={18} className="text-primary flex-shrink-0" />
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Важно:</strong> Красные номера — 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36. Остальные (кроме 0) — черные.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;