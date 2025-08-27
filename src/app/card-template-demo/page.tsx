'use client';

import SimpleCardTemplate from '@/components/cards/SimpleCardTemplate';
import Header from '@/components/header/Header';

export default function CardTemplateDemoPage() {
  const handleCall = () => {
    // Placeholder for call functionality
    alert('撥打電話功能將在這裡實現');
  };

  const handleMessage = () => {
    // Placeholder for message functionality
    alert('傳送訊息功能將在這裡實現');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">名片模板展示</h1>
          <p className="text-gray-600">基於提供的HTML和CSS代碼創建的簡潔名片模板</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tech Theme Card */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">科技主題</h3>
              <SimpleCardTemplate
                name="Grace Chen"
                position="軟體工程師"
                company="INNOVATECH"
                companyTagline="創新科技 設計·開發 解決方案"
                description="我們專注於開發創新軟體應用，結合先進技術與設計，打造卓越的解決方案，助企業在數位時代中脫穎而出。"
                theme="tech"
                onCall={handleCall}
                onMessage={handleMessage}
              />
            </div>

            {/* Finance Theme Card */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">金融主題</h3>
              <SimpleCardTemplate
                name="Grace Chen"
                position="軟體工程師"
                company="INNOVATECH"
                companyTagline="創新科技 設計·開發 解決方案"
                description="我們專注於開發創新軟體應用，結合先進技術與設計，打造卓越的解決方案，助企業在數位時代中脫穎而出。"
                theme="finance"
                onCall={handleCall}
                onMessage={handleMessage}
              />
            </div>

            {/* Healthcare Theme Card */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">醫療主題</h3>
              <SimpleCardTemplate
                name="Grace Chen"
                position="軟體工程師"
                company="INNOVATECH"
                companyTagline="創新科技 設計·開發 解決方案"
                description="我們專注於開發創新軟體應用，結合先進技術與設計，打造卓越的解決方案，助企業在數位時代中脫穎而出。"
                theme="healthcare"
                onCall={handleCall}
                onMessage={handleMessage}
              />
            </div>
          </div>

          {/* Code Examples Section */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">代碼示例</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* HTML Code */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">HTML 代碼</h3>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{`<div class="card tech">
  <h2>Grace Chen</h2>
  <p>軟體工程師</p>
  <h3>INNOVATECH</h3>
  <p>創新科技 設計·開發 解決方案</p>
  <p>我們專注於開發創新軟體應用，結合先進技術與設計，打造卓越的解決方案，助企業在數位時代中脫穎而出。</p>
  <button>撥打電話</button>
  <button>傳送訊息</button>
</div>`}</code>
                </pre>
              </div>

              {/* CSS Code */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">CSS 代碼</h3>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{`.card {
  max-width: 350px;
  padding: 20px;
  margin: 20px auto;
  border-radius: 10px;
  font-family: 'Segoe UI', sans-serif;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  color: #333;
}
.card h2 {
  margin-bottom: 5px;
  font-size: 24px;
}
.card h3 {
  margin-top: 10px;
  font-size: 18px;
  color: #555;
}
.card p {
  font-size: 14px;
  line-height: 1.6;
}
.card button {
  margin: 10px 5px 0 0;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.tech {
  background-color: #e6f7ff;
}
.finance {
  background-color: #f0f8ff;
}
.healthcare {
  background-color: #f9f9f9;
}
button:first-of-type {
  background-color: #0078d4;
  color: white;
}
button:last-of-type {
  background-color: #e0e0e0;
  color: #333;
}`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">使用說明</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-lg mb-2">組件屬性</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><code className="bg-gray-200 px-1 rounded">name</code> - 姓名</li>
                  <li><code className="bg-gray-200 px-1 rounded">position</code> - 職位</li>
                  <li><code className="bg-gray-200 px-1 rounded">company</code> - 公司名稱</li>
                  <li><code className="bg-gray-200 px-1 rounded">companyTagline</code> - 公司標語</li>
                  <li><code className="bg-gray-200 px-1 rounded">description</code> - 描述文字</li>
                  <li><code className="bg-gray-200 px-1 rounded">theme</code> - 主題 (tech, finance, healthcare)</li>
                  <li><code className="bg-gray-200 px-1 rounded">onCall</code> - 撥打電話回調函數</li>
                  <li><code className="bg-gray-200 px-1 rounded">onMessage</code> - 傳送訊息回調函數</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">使用示例</h3>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm">
                  <code>{`import SimpleCardTemplate from '@/components/cards/SimpleCardTemplate';

<SimpleCardTemplate
  name="Grace Chen"
  position="軟體工程師"
  company="INNOVATECH"
  companyTagline="創新科技 設計·開發 解決方案"
  description="我們專注於開發創新軟體應用..."
  theme="tech"
  onCall={() => console.log('Call clicked')}
  onMessage={() => console.log('Message clicked')}
/>`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}