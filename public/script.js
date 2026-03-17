const form = document.getElementById('solveForm');
const expressionInput = document.getElementById('expression');
const detectButton = document.getElementById('detectButton');
const solveButton = document.getElementById('solveButton');
const statusText = document.getElementById('statusText');
const resultExpression = document.getElementById('resultExpression');
const resultInputs = document.getElementById('resultInputs');
const resultValue = document.getElementById('resultValue');
const variableFields = document.getElementById('variableFields');
const variableHelp = document.getElementById('variableHelp');
let variablesDetected = false;

const renderVariableFields = (variables) => {
	if (!variableFields) {
		return;
	}

	variableFields.innerHTML = '';

	if (!variables.length) {
		const noVars = document.createElement('p');
		noVars.id = 'variableHelp';
		noVars.textContent = 'No variables detected. Add symbols like a, b, c, x.';
		variableFields.appendChild(noVars);
		variablesDetected = true;
		return;
	}

	variablesDetected = true;

	variables.forEach((name) => {
		const label = document.createElement('label');
		label.setAttribute('for', `var_${name}`);
		label.textContent = `${name}:`;

		const input = document.createElement('input');
		input.id = `var_${name}`;
		input.name = name;
		input.type = 'number';
		input.step = 'any';
		input.required = true;
		input.placeholder = `${name} value`;

		variableFields.appendChild(label);
		variableFields.appendChild(input);
	});
};

const detectVariables = async () => {
	const expression = expressionInput?.value?.trim() || '';

	if (!expression) {
		renderVariableFields([]);
		statusText.textContent = 'Enter an expression and click Detect Variables.';
		variablesDetected = false;
		return;
	}

	try {
		const payload = new URLSearchParams({ expression });
		const response = await fetch('/variables', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
			},
			body: payload
		});
		let data;

		try {
			data = await response.json();
		} catch (parseError) {
			throw new Error(`Variable detection endpoint returned non-JSON (status ${response.status}).`);
		}

		if (!response.ok) {
			throw new Error(data.error || 'Could not detect variables');
		}

		renderVariableFields(data.variables || []);
		statusText.textContent = 'Variables detected. Fill values and click Solve.';
	} catch (error) {
		statusText.textContent = error.message || 'Invalid expression. Fix it to detect variables.';
		renderVariableFields([]);
		variablesDetected = false;
		console.error(error);
	}
};

if (form) {
	detectButton?.addEventListener('click', async () => {
		detectButton.disabled = true;
		statusText.textContent = 'Detecting variables...';

		try {
			await detectVariables();
		} finally {
			detectButton.disabled = false;
		}
	});

	form.addEventListener('submit', async (event) => {
		event.preventDefault();

		if (!variablesDetected) {
			statusText.textContent = 'Click Detect Variables before solving.';
			return;
		}

		solveButton.disabled = true;
		statusText.textContent = 'Calculating...';

		try {
			const payload = new URLSearchParams(new FormData(form));
			const response = await fetch('/solve', {
				method: 'POST',
				headers: {
					Accept: 'application/json'
				},
				body: payload
			});

			if (!response.ok) {
				throw new Error(`Request failed with status ${response.status}`);
			}

			const data = await response.json();
			statusText.textContent = 'Solved successfully.';
			resultExpression.textContent = data.expression ?? '-';
			resultInputs.textContent = JSON.stringify(data.inputs ?? {});
			resultValue.textContent = String(data.result ?? '-');
		} catch (error) {
			statusText.textContent = 'Failed to solve expression. Please try again.';
			resultValue.textContent = 'Error';
			console.error(error);
		} finally {
			solveButton.disabled = false;
		}
	});

	if (variableHelp) {
		variableHelp.textContent = 'Enter the expression, then click Detect Variables.';
	}
}
