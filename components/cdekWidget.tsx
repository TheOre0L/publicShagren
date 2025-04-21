'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/http/requests';

interface CDEKWidgetType {
  open: () => void;
}

const CdekWidget = ({ setSelectPoint }): JSX.Element => {
  const widget = useRef<CDEKWidgetType | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const logError = (message: string, error?: any) => {
    console.error(message, error);
  };

  const getWidgetConfig = () => ({
    apiKey: '9aa1379b-a4de-4be0-892e-31602ef63eeb',
    canChoose: true,
    servicePath: `${API_URL}/cdek/widget`,
    defaultLocation: 'Новосибирск',
    from: {
      // Код страны населенного пункта отправителя в формате ISO_3166-1_alpha-2
      country_code: 'RU',
      // Название населенного пункта отправителя
      city: 'Невинномысск',
      // Почтовый индекс населенного пункта отправителя
      postal_code: 357108,
      // Код населенного пункта CDEK
      code: 1079,
      // Адрес откуда произойдет отправка курьером в населеном пункте
      address: 'ул. Краснопартизанская, д. 5',
    },
    goods: [
        {
            length: 10,
            width: 10,
            height: 10,
            weight: 1,
        }],

    debug: true,
    lang: 'rus',
    hideDeliveryOptions: {
      office: false,
    },
    popup: true,
    onReady: () => console.log('Widget is ready'),
    onChoose: (delivery: string, rate: string, address: string) => {
      setSelectPoint({ delivery, rate, address });
    },
    onCalculate(tariffs, address) {
      alert('Была рассчитана стоимость доставки');
      console.log('Подсчитаны тарифы', tariffs);
      console.log('Адрес подсчета', address);
  },
  });

  // Динамическая загрузка скрипта CDEK
  const loadScript = useCallback(() => {
    if (document.getElementById('cdek-widget-script')) return;

    const script = document.createElement('script');
    script.id = 'cdek-widget-script';
    script.src = 'https://cdn.jsdelivr.net/npm/@cdek-it/widget@3';
    script.async = true;
    script.onload = () => {
      console.log('CDEK Widget script loaded');
      setIsScriptLoaded(true);
    };
    script.onerror = () => logError('Ошибка загрузки CDEK Widget');

    document.body.appendChild(script);
  }, []);

  // Инициализация виджета после загрузки скрипта
  useEffect(() => {
    loadScript();
  }, []);

  useEffect(() => {
    if (isScriptLoaded && window.CDEKWidget) {
      try {
        widget.current = new window.CDEKWidget(getWidgetConfig());
      } catch (error) {
        logError('Ошибка инициализации CDEK Widget:', error);
      }
    } else if (isScriptLoaded) {
      logError('CDEK Widget не найден после загрузки скрипта');
    }
  }, [isScriptLoaded]);

  return (
    <div className="widget-container">
      <Button
        type='button'
        className="relative w-full h-[50px] bg-amber-700 hover:bg-amber-800 rounded-lg overflow-hidden mb-4"
        onClick={() => {
            setTimeout(() => {
              if (widget.current) {
                try {
                  widget.current.open();
                } catch (error) {
                  logError('Ошибка открытия CDEK Widget:', error);
                }
              } else {
                logError('CDEK Widget ещё не инициализирован');
              }
            }, 1000); // Задержка 300 мс         
        }}
      >
        Выбрать пункт выдачи
      </Button>
    </div>
  );
};

export default CdekWidget;
