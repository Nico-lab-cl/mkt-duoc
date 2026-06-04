import { argv } from 'process';

// Obtener la URL base desde los argumentos o usar una por defecto
const targetUrl = argv[2] || 'http://localhost:80/api/leads';
const concurrentUsers = parseInt(argv[3]) || 50;

console.log(`==================================================`);
console.log(`🚀 INICIANDO PRUEBA DE ESTRÉS DE FERIA VOCACIONAL`);
console.log(`🎯 URL Objetivo: ${targetUrl}`);
console.log(`👥 Usuarios Concurrentes Simulados: ${concurrentUsers}`);
console.log(`==================================================\n`);

const runTest = async () => {
  const startTime = Date.now();
  let completed = 0;
  let success = 0;
  let failed = 0;
  const responseTimes = [];

  // Crear las promesas de peticiones concurrentes
  const requests = Array.from({ length: concurrentUsers }).map(async (_, index) => {
    const userId = index + 1;
    const reqStartTime = Date.now();
    
    const leadData = {
      first_name: `TestName${userId}`,
      last_name: `TestLastName${userId}`,
      age: 18,
      region: 'Región de Valparaíso',
      city: 'Viña del Mar',
      school: 'Colegio de Prueba',
      email: `test_user_${userId}_${Math.floor(Math.random() * 100000)}@test.com`,
      phone: '+56912345678',
      favorite_social: ['TikTok', 'Instagram', 'YouTube', 'Twitch'][Math.floor(Math.random() * 4)],
      test_answer: ['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 6)]
    };

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      const data = await response.json();
      
      const reqDuration = Date.now() - reqStartTime;
      responseTimes.push(reqDuration);

      if (response.ok && data.success) {
        success++;
      } else {
        failed++;
        console.error(`❌ Petición #${userId} falló con estado: ${response.status}`, data);
      }
    } catch (err) {
      failed++;
      console.error(`❌ Error de conexión en petición #${userId}:`, err.message);
    } finally {
      completed++;
    }
  });

  // Esperar a que terminen todas las peticiones
  await Promise.all(requests);

  const totalDuration = Date.now() - startTime;
  const avgResponseTime = responseTimes.length > 0 
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
    : 0;

  console.log(`\n==================================================`);
  console.log(`📊 RESULTADOS DE LA PRUEBA DE ESTRÉS`);
  console.log(`==================================================`);
  console.log(`✓ Peticiones Completadas: ${completed}`);
  console.log(`✓ Exitosas: ${success} 🎉`);
  console.log(`✗ Fallidas: ${failed} ⚠️`);
  console.log(`⏱ Tiempo Total de la Ráfaga: ${totalDuration} ms`);
  console.log(`⏱ Tiempo de Respuesta Promedio: ${avgResponseTime.toFixed(2)} ms`);
  console.log(`==================================================\n`);
};

runTest();
