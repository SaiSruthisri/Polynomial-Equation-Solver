const math = require('mathjs');
const Equation = require('../models/equation');

const RESERVED_SYMBOLS = new Set(['e', 'pi', 'tau', 'phi', 'i', 'Infinity', 'NaN', 'true', 'false']);

exports.showForm = (req, res) => {
  res.render('index');
};

exports.detectVariables = (req, res) => {
  const expression = (req.body?.expression || '').trim();

  if (!expression) {
    return res.status(400).json({ error: 'Expression is required.' });
  }

  try {
    const exprTree = math.parse(expression);
    const variableSet = new Set();

    exprTree.traverse((node, path, parent) => {
      if (!node.isSymbolNode) {
        return;
      }

      const isFunctionName = parent?.isFunctionNode && parent.fn === node;
      if (isFunctionName) {
        return;
      }

      if (RESERVED_SYMBOLS.has(node.name)) {
        return;
      }

      variableSet.add(node.name);
    });

    return res.json({ expression, variables: Array.from(variableSet).sort() });
  } catch (err) {
    return res.status(400).json({ error: `Invalid expression syntax: ${err.message}` });
  }
};

exports.solveExpression = async (req, res) => {
  const { expression, ...rawInputs } = req.body;
  const inputs = {};

  Object.entries(rawInputs).forEach(([key, value]) => {
    if (value === '' || value === undefined || value === null) {
      return;
    }

    const parsed = Number(value);
    inputs[key] = Number.isNaN(parsed) ? value : parsed;
  });

  let result;

  try {
    result = math.evaluate(expression, inputs);
  } catch (err) {
    result = 'Error in expression';
  }

  // MongoDB persistence is temporarily on hold.
  // Uncomment this block when database save needs to be enabled again.
  // try {
  //   const eq = new Equation({ expression, inputs, result });
  //   await eq.save();
  // } catch (err) {
  //   console.error('Skipping DB save:', err.message);
  // }

  const wantsJson = req.xhr || req.headers.accept?.includes('application/json');

  if (wantsJson) {
    return res.json({ expression, inputs, result });
  }

  res.render('result', { expression, inputs, result });
};
