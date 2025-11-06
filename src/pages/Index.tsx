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
  timestamp: Date;
}

const Index = () => {
  const [hash, setHash] = useState('');
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null);
  const [history, setHistory] = useState<Prediction[]>([]);
  const { toast } = useToast();

  const predictFromHash = (hashValue: string): 'red' | 'black' | 'green' => {
    if (!hashValue || hashValue.length < 40) {
      return 'red';
    }

    const lastChar = hashValue.slice(-1).toLowerCase();
    const charCode = lastChar.charCodeAt(0);
    
    if (charCode % 37 === 0) {
      return 'green';
    }
    
    return charCode % 2 === 0 ? 'red' : 'black';
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

    const result = predictFromHash(hash);
    const prediction: Prediction = {
      hash,
      result,
      timestamp: new Date(),
    };

    setCurrentPrediction(prediction);
    setHistory((prev) => [prediction, ...prev].slice(0, 50));
    
    toast({
      title: 'Предсказание готово!',
      description: `Результат: ${result === 'red' ? '🔴 Красный' : result === 'black' ? '⚫ Черный' : '🟢 Зеленый'}`,
    });
  };

  const getResultColor = (result: 'red' | 'black' | 'green') => {
    switch (result) {
      case 'red':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'black':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
      case 'green':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Sparkles" size={40} className="text-primary" />
            <h1 className="text-5xl font-bold gradient-text">Рулетка Предсказатель</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Анализ SHA-1 хешей для телеграм бота{' '}
            <span className="text-primary font-medium">@qalais_bot</span>
          </p>
        </header>

        <Tabs defaultValue="predict" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="predict">
              <Icon name="Sparkles" size={18} className="mr-2" />
              Предсказание
            </TabsTrigger>
            <TabsTrigger value="history">
              <Icon name="History" size={18} className="mr-2" />
              История
            </TabsTrigger>
            <TabsTrigger value="guide">
              <Icon name="BookOpen" size={18} className="mr-2" />
              Инструкция
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predict" className="space-y-6">
            <Card className="max-w-2xl mx-auto border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Hash" size={24} />
                  Введите SHA-1 хеш
                </CardTitle>
                <CardDescription>
                  Скопируйте хеш из бота и получите предсказание цвета рулетки
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="9249fda6fa3809fa6c53c96dcb635e1943c7b073"
                    value={hash}
                    onChange={(e) => setHash(e.target.value.toLowerCase())}
                    className="font-mono-hash text-base"
                    maxLength={40}
                  />
                  <p className="text-xs text-muted-foreground">
                    {hash.length}/40 символов
                  </p>
                </div>
                <Button onClick={handlePredict} className="w-full" size="lg">
                  <Icon name="Zap" size={20} className="mr-2" />
                  Получить предсказание
                </Button>
              </CardContent>
            </Card>

            {currentPrediction && (
              <Card className="max-w-2xl mx-auto border-2 border-primary/50 animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Target" size={24} />
                    Результат предсказания
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center gap-4 p-8 rounded-lg bg-muted/50">
                    <div className="text-7xl">{getResultEmoji(currentPrediction.result)}</div>
                    <div className="text-5xl font-bold">
                      {currentPrediction.result === 'red' && 'Красный'}
                      {currentPrediction.result === 'black' && 'Черный'}
                      {currentPrediction.result === 'green' && 'Зеленый'}
                    </div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">Хеш:</p>
                    <p className="font-mono-hash text-sm break-all">{currentPrediction.hash}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">🔴</div>
                    <div>
                      <p className="text-sm text-muted-foreground">Красных</p>
                      <p className="text-2xl font-bold">{stats.red}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">⚫</div>
                    <div>
                      <p className="text-sm text-muted-foreground">Черных</p>
                      <p className="text-2xl font-bold">{stats.black}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">🟢</div>
                    <div>
                      <p className="text-sm text-muted-foreground">Зеленых</p>
                      <p className="text-2xl font-bold">{stats.green}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="History" size={24} />
                  История предсказаний
                </CardTitle>
                <CardDescription>
                  {history.length > 0
                    ? `Всего предсказаний: ${history.length}`
                    : 'История пока пуста'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Пока нет предсказаний</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {history.map((prediction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-mono-hash text-xs text-muted-foreground truncate">
                            {prediction.hash}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {prediction.timestamp.toLocaleString('ru-RU')}
                          </p>
                        </div>
                        <Badge className={`ml-4 ${getResultColor(prediction.result)}`}>
                          {getResultEmoji(prediction.result)}{' '}
                          {prediction.result === 'red' && 'Красный'}
                          {prediction.result === 'black' && 'Черный'}
                          {prediction.result === 'green' && 'Зеленый'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="BookOpen" size={24} />
                  Как пользоваться
                </CardTitle>
                <CardDescription>Инструкция по работе с предсказателем</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Откройте бота @qalais_bot</h3>
                      <p className="text-sm text-muted-foreground">
                        Найдите телеграм бота и запустите мини-игру рулетка
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Скопируйте SHA-1 хеш</h3>
                      <p className="text-sm text-muted-foreground">
                        Бот покажет зашифрованный результат в виде хеша из 40 символов
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Вставьте хеш на сайте</h3>
                      <p className="text-sm text-muted-foreground">
                        Перейдите на вкладку "Предсказание" и вставьте скопированный хеш
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Получите предсказание</h3>
                      <p className="text-sm text-muted-foreground">
                        Система проанализирует хеш и покажет результат: красный, черный или зеленый
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex gap-2 items-start">
                    <Icon name="Info" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1">О SHA-1 хеше</h4>
                      <p className="text-xs text-muted-foreground">
                        SHA-1 — криптографический алгоритм, который преобразует данные в строку из 40 символов. 
                        Вы видите зашифрованный результат до его раскрытия, что гарантирует честность игры.
                      </p>
                    </div>
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
