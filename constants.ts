import { Topic, LearningType } from './types';

export const ML_TOPICS: Topic[] = [
  {
    id: 'intro',
    title: 'Introduction to ML',
    type: LearningType.GENERAL,
    description: 'The foundation of teaching computers to learn from data.',
    content: `Machine Learning (ML) is a subset of artificial intelligence (AI) that focuses on building systems that learn—or improve performance—based on data they consume.
    
Instead of explicitly programming rules (e.g., "if x > 5 then do y"), we provide the machine with data and allow it to discover patterns and rules on its own.`,
    math: [],
    useCases: ['Spam Detection', 'Recommendation Systems', 'Self-driving Cars'],
    viz: { type: 'none' }
  },
  {
    id: 'linear-regression',
    title: 'Linear Regression',
    type: LearningType.SUPERVISED,
    description: 'Predicting a continuous value based on input features.',
    content: `Linear regression attempts to model the relationship between two variables by fitting a linear equation to observed data. One variable is considered to be an explanatory variable, and the other is considered to be a dependent variable.`,
    math: [
      {
        title: 'Hypothesis Function',
        content: 'The predicted value y-hat is a linear combination of weights and inputs.',
        formula: 'h_\\theta(x) = \\theta_0 + \\theta_1 x'
      },
      {
        title: 'Cost Function (MSE)',
        content: 'We measure accuracy using the Mean Squared Error.',
        formula: 'J(\\theta) = \\frac{1}{2m} \\sum_{i=1}^{m} (h_\\theta(x^{(i)}) - y^{(i)})^2'
      },
      {
        title: 'Gradient Descent Update',
        content: 'We update weights to minimize the cost function.',
        formula: '\\theta_j := \\theta_j - \\alpha \\frac{\\partial}{\\partial \\theta_j} J(\\theta)'
      }
    ],
    useCases: ['House Price Prediction', 'Sales Forecasting', 'Risk Assessment'],
    viz: { type: 'linear-regression' }
  },
  {
    id: 'neural-networks',
    title: 'Neural Networks',
    type: LearningType.SUPERVISED,
    description: 'Modeling complex patterns using layers of interconnected nodes.',
    content: `Neural networks are computing systems inspired by the biological neural networks that constitute animal brains. An ANN is based on a collection of connected units or nodes called artificial neurons, which loosely model the neurons in a biological brain.`,
    math: [
      {
        title: 'Neuron Activation',
        content: 'Input is weighted, summed, plus a bias, then passed through an activation function.',
        formula: 'a = \\sigma(\\sum w_i x_i + b)'
      }
    ],
    useCases: ['Image Recognition', 'Natural Language Processing', 'Game AI'],
    viz: { type: 'neural-network' }
  },
  {
    id: 'k-means',
    title: 'K-Means Clustering',
    type: LearningType.UNSUPERVISED,
    description: 'Partitioning data into K distinct clusters based on feature similarity.',
    content: `K-Means is an iterative algorithm that tries to partition the dataset into K pre-defined distinct non-overlapping subgroups (clusters) where each data point belongs to only one group.`,
    math: [
      {
        title: 'Objective Function',
        content: 'Minimize the within-cluster sum of squares (WCSS).',
        formula: 'J = \\sum_{i=1}^{k} \\sum_{x \\in S_i} ||x - \\mu_i||^2'
      }
    ],
    useCases: ['Customer Segmentation', 'Document Clustering', 'Image Compression'],
    viz: { type: 'k-means' }
  },
  {
    id: 'pca',
    title: 'Principal Component Analysis',
    type: LearningType.UNSUPERVISED,
    description: 'Dimensionality reduction that preserves the most important patterns in the data.',
    content: `Principal Component Analysis (PCA) is a technique used to emphasize variation and bring out strong patterns in a dataset. It's often used to make data easy to explore and visualize.
    
It works by finding the "principal components" - the directions where there is the most variance, the most information. It then projects the data onto these components, allowing us to reduce dimensions (e.g., from 3D to 2D) with minimal loss of information.`,
    math: [
      {
        title: 'Covariance Matrix',
        content: 'Measures how two variables change together.',
        formula: '\\Sigma = \\frac{1}{m} \\sum_{i=1}^{m} (x^{(i)})(x^{(i)})^T'
      },
      {
        title: 'Eigenvalue Equation',
        content: 'Finding vectors (u) that only scale (by lambda) when transformed.',
        formula: '\\Sigma u = \\lambda u'
      }
    ],
    useCases: ['Data Visualization', 'Noise Reduction', 'Feature Extraction'],
    viz: { type: 'pca' }
  }
];