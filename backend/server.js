const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// মেস ক্যালকুলেশন API Endpoint
app.post('/api/calculate', (req, res) => {
  const { members, utility } = req.body;

  const totalMembers = members.length;
  const totalBazarCost = members.reduce((sum, m) => sum + (m.bazarCost || 0), 0);
  const totalRiceCost = members.reduce((sum, m) => sum + (m.riceCost || 0), 0);
  const totalMealCost = totalBazarCost + totalRiceCost;
  const subTotalMeal = members.reduce((sum, m) => sum + (m.totalMeal || 0), 0);

  const mealRate = subTotalMeal > 0 ? totalMealCost / subTotalMeal : 0;

  const totalUtilityCost =
    (utility.gasBill || 0) +
    (utility.electricityBill || 0) +
    (utility.liftBill || 0) +
    (utility.wifiBill || 0) +
    (utility.khalaBill || 0) +
    (utility.garbageBill || 0);

  const perPersonUtilityCost = totalMembers > 0 ? totalUtilityCost / totalMembers : 0;

  const calculatedMembers = members.map((m) => {
    const totalCost = m.bazarCost + m.riceCost;
    const perMealCost = m.totalMeal * mealRate;
    const mealPlusUtility = perMealCost + perPersonUtilityCost;
    const rawFinancialPosition = totalCost - (mealPlusUtility + m.roomRent);

    let ceilingFinancialPosition = 0;
    if (rawFinancialPosition > 0) {
      ceilingFinancialPosition = Math.ceil(rawFinancialPosition);
    } else if (rawFinancialPosition < 0) {
      ceilingFinancialPosition = Math.floor(rawFinancialPosition);
    }

    return {
      ...m,
      totalCost,
      perMealCost,
      mealPlusUtility,
      rawFinancialPosition,
      ceilingFinancialPosition,
    };
  });

  res.json({
    totalMembers,
    totalBazarCost,
    totalRiceCost,
    totalMealCost,
    subTotalMeal,
    mealRate,
    totalUtilityCost,
    perPersonUtilityCost,
    members: calculatedMembers,
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});