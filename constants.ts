import { Topic, LearningType } from './types';

export const ML_TOPICS: Topic[] = [
  {
    id: 'intro',
    title: 'Introduction to Machine Learning',
    type: LearningType.GENERAL,
    description: 'A paradigm shift from explicit programming to data-driven inductive inference.',
    content: `Machine Learning (ML) represents a fundamental evolution in computer science. Traditionally, software engineering involved writing explicit rules—a deductive approach where we define the logic (e.g., "if specific condition X is met, perform action Y"). However, for many complex tasks like recognizing a face or understanding spoken language, defining these rules explicitly is intractable due to the sheer number of variations and edge cases.

Machine Learning flips this paradigm. Instead of programming the rules, we program a system to *learn* the rules from data. This is an inductive approach: we provide the system with examples (input-output pairs in supervised learning) and an objective function (a mathematical way to measure "wrongness"), and the system optimizes its internal parameters to minimize this error.

The core essence of ML is **Generalization**. It is not enough to memorize the training data; the model must build an internal representation of the underlying patterns such that it can make accurate predictions on new, unseen data.`,
    math: [
      {
        title: 'The Learning Problem',
        content: 'We seek a function f that maps inputs X to outputs Y, minimizing a loss function L over a probability distribution D.',
        formula: '\\min_f \\mathbb{E}_{(x,y) \\sim D} [L(f(x), y)]'
      }
    ],
    useCases: ['Spam Filtering', 'Credit Scoring', 'Medical Diagnosis', 'Recommendation Engines', 'Autonomous Navigation'],
    viz: { type: 'none' }
  },
  {
    id: 'logistic-regression',
    title: 'Logistic Regression',
    type: LearningType.SUPERVISED,
    description: 'A probabilistic classifier that models the likelihood of a binary outcome.',
    content: `Despite its name, Logistic Regression is a **classification** algorithm, not a regression algorithm. It is the fundamental building block of classification in machine learning and serves as the basis for neural networks (a single neuron with a sigmoid activation is essentially a logistic regression unit).

While Linear Regression predicts a continuous value (like price), Logistic Regression predicts the **probability** that an instance belongs to a specific class (e.g., "60% chance this email is spam"). To achieve this, we cannot use a straight line that extends to infinity; probabilities must be bounded between 0 and 1.

We solve this by applying a "squashing" function, specifically the **Sigmoid function** (or Logistic function), to the linear output. This maps any real-valued number into the (0, 1) interval. The model learns a linear decision boundary (a hyperplane) that separates the classes. If the linear combination of inputs is positive, the probability is > 0.5 (Class 1); if negative, it is < 0.5 (Class 0).

Because we are dealing with probabilities, we cannot use Mean Squared Error (MSE) as our cost function, as it results in a non-convex surface with many local minima, making optimization difficult. Instead, we use **Log Loss** (Cross-Entropy Loss), which is convex and heavily penalizes confident but wrong predictions.`,
    math: [
      {
        title: 'The Sigmoid Function',
        content: 'This function maps any real-valued number z to the range (0, 1), interpreted as a probability.',
        formula: '\\sigma(z) = \\frac{1}{1 + e^{-z}}'
      },
      {
        title: 'Hypothesis Representation',
        content: 'The model estimates the probability that y=1 given input x.',
        formula: 'h_\\theta(x) = P(y=1|x;\\theta) = \\sigma(\\theta^T x)'
      },
      {
        title: 'Decision Boundary',
        content: 'We classify as 1 if the probability is greater than 0.5, which implies the linear input is positive.',
        formula: '\\text{Predict } 1 \\iff \\theta^T x \\geq 0'
      },
      {
        title: 'Cost Function (Cross-Entropy)',
        content: 'Derived from Maximum Likelihood Estimation (MLE). If y=1, we want h to be close to 1 (minimize -log(h)). If y=0, we want h to be close to 0 (minimize -log(1-h)).',
        formula: 'J(\\theta) = - \\frac{1}{m} \\sum_{i=1}^{m} [y^{(i)} \\log(h_\\theta(x^{(i)})) + (1-y^{(i)}) \\log(1 - h_\\theta(x^{(i)}))]'
      }
    ],
    useCases: ['Email Spam Detection (Spam vs Ham)', 'Disease Diagnosis (Malignant vs Benign)', 'Customer Churn Prediction (Leave vs Stay)'],
    viz: { type: 'logistic-regression' }
  },
  {
    id: 'linear-regression',
    title: 'Linear Regression',
    type: LearningType.SUPERVISED,
    description: 'Modeling the linear relationship between a dependent continuous variable and independent predictors.',
    content: `Linear Regression is often the first algorithm taught in machine learning because of its simplicity and interpretability. Ideally, it models the relationship between a scalar response (or dependent variable) and one or more explanatory variables (or independent variables) using a linear function.

The core assumption is that the output is a weighted sum of the inputs plus some noise. Geometrically, this looks like fitting a straight line (in 2D) or a hyperplane (in higher dimensions) through the data points.

We determine the "best" line by minimizing the vertical distance (residuals) between the observed data points and the line. This specific method is called **Ordinary Least Squares (OLS)**. We square the errors to treat negative and positive errors equally and to penalize larger errors more severely.

**Key Assumptions:**
1. **Linearity**: The relationship between X and the mean of Y is linear.
2. **Homoscedasticity**: The variance of residual is the same for any value of X.
3. **Independence**: Observations are independent of each other.
4. **Normality**: For any fixed value of X, Y is normally distributed.`,
    math: [
      {
        title: 'Hypothesis Function',
        content: 'The predicted value is a linear combination of the input features and weights (parameters).',
        formula: 'h_\\theta(x) = \\theta_0 + \\theta_1 x_1 + ... + \\theta_n x_n = \\theta^T x'
      },
      {
        title: 'Cost Function (MSE)',
        content: 'We define the cost J as the Mean Squared Error between the predictions and actual values.',
        formula: 'J(\\theta) = \\frac{1}{2m} \\sum_{i=1}^{m} (h_\\theta(x^{(i)}) - y^{(i)})^2'
      },
      {
        title: 'Normal Equation (Closed Form Solution)',
        content: 'Unlike iterative Gradient Descent, we can solve for optimal theta directly using linear algebra (minimizing the gradient to zero).',
        formula: '\\theta = (X^T X)^{-1} X^T y'
      }
    ],
    useCases: ['Predicting Housing Prices', 'Estimating Product Sales', 'Financial Forecasting', 'Risk Assessment'],
    viz: { type: 'linear-regression' }
  },
  {
    id: 'neural-networks',
    title: 'Neural Networks (Deep Learning)',
    type: LearningType.SUPERVISED,
    description: 'Function approximation machines inspired by biological brains, capable of modeling highly non-linear complex relationships.',
    content: `Artificial Neural Networks (ANNs) form the backbone of Deep Learning. While simple linear models can only separate data with straight lines or planes, neural networks can learn incredibly complex, non-linear decision boundaries.

They consist of layers of nodes (neurons):
1. **Input Layer**: Receives the raw data.
2. **Hidden Layers**: Perform mathematical transformations. The term "deep" learning simply refers to networks with many hidden layers.
3. **Output Layer**: Produces the final prediction.

The power of neural networks comes from **Non-Linear Activation Functions** (like ReLU, Tanh, or Sigmoid) applied after each layer. Without these, no matter how many layers you stack, the entire network would collapse mathematically into a single linear regression model.

Training involves two passes:
1. **Forward Propagation**: Data flows through to generate a prediction.
2. **Backpropagation**: We calculate the error and compute the gradient of the loss function with respect to every weight in the network using the Chain Rule of calculus. This signal flows backward, updating weights to reduce error.`,
    math: [
      {
        title: 'Single Neuron Computation',
        content: 'A neuron computes a weighted sum of its inputs, adds a bias term, and applies a non-linear activation function phi.',
        formula: 'a_j^{(l)} = \\phi( \\sum_{k} w_{jk}^{(l)} a_k^{(l-1)} + b_j^{(l)} )'
      },
      {
        title: 'Backpropagation (Chain Rule)',
        content: 'To update a weight w, we find how the Cost C changes with respect to w. We chain partial derivatives from the output back to the weight.',
        formula: '\\frac{\\partial C}{\\partial w} = \\frac{\\partial C}{\\partial a} \\cdot \\frac{\\partial a}{\\partial z} \\cdot \\frac{\\partial z}{\\partial w}'
      }
    ],
    useCases: ['Computer Vision (CNNs)', 'Natural Language Processing (Transformers)', 'Generative AI', 'Game Playing Agents'],
    viz: { type: 'neural-network' }
  },
  {
    id: 'k-means',
    title: 'K-Means Clustering',
    type: LearningType.UNSUPERVISED,
    description: 'An iterative algorithm that partitions data into K distinct, non-overlapping subgroups based on geometric proximity.',
    content: `Unsupervised learning deals with unlabeled data. We don't have the "right answer" (y); we just have the features (X). The goal is to discover hidden structures or patterns.

K-Means is a centroid-based algorithm, meaning it represents each cluster by a central vector (centroid). The "K" refers to the number of clusters, which is a hyperparameter you must choose in advance.

The algorithm follows a simple Expectation-Maximization style loop:
1. **Assignment Step**: Assign every data point to the closest centroid (usually based on Euclidean distance).
2. **Update Step**: Re-calculate the position of the centroids by taking the mean average of all points assigned to that cluster.

This process repeats until the centroids stop moving (convergence). While simple and fast, K-Means is sensitive to the initial placement of centroids (leading to the "bad initialization" problem) and assumes clusters are spherical and roughly the same size.`,
    math: [
      {
        title: 'Euclidean Distance',
        content: 'Standard metric for "closeness" between point x and centroid mu.',
        formula: 'd(x, \\mu) = ||x - \\mu||_2 = \\sqrt{\\sum_{j=1}^{n} (x_j - \\mu_j)^2}'
      },
      {
        title: 'Optimization Objective (Inertia)',
        content: 'We seek to minimize the "Within-Cluster Sum of Squares" (WCSS).',
        formula: '\\min_S \\sum_{i=1}^{k} \\sum_{x \\in S_i} ||x - \\mu_i||^2'
      }
    ],
    useCases: ['Customer Segmentation', 'Image Color Compression', 'Anomaly Detection (outliers)', 'Document Clustering'],
    viz: { type: 'k-means' }
  },
  {
    id: 'pca',
    title: 'Principal Component Analysis (PCA)',
    type: LearningType.UNSUPERVISED,
    description: 'A statistical procedure that uses orthogonal transformation to convert correlated variables into linearly uncorrelated principal components.',
    content: `In modern datasets, we often suffer from the **Curse of Dimensionality**. Having too many features (columns) can make training slow and models prone to overfitting because the data becomes sparse in high-dimensional space.

Principal Component Analysis (PCA) is a dimensionality reduction technique. It allows us to compress the data while retaining as much information (variance) as possible.

It works by identifying the "Principal Components" (directions) in the data that contain the most variance.
1. The **First Principal Component (PC1)** is the direction along which the data varies the most.
2. The **Second Principal Component (PC2)** is orthogonal (perpendicular) to the first and captures the second most variance.

Mathematically, these directions are the **Eigenvectors** of the data's Covariance Matrix, and their magnitude/importance corresponds to the **Eigenvalues**. By projecting data onto just the top few eigenvectors, we reduce the dimensions.`,
    math: [
      {
        title: 'Covariance Matrix',
        content: 'A square matrix giving the covariance between each pair of elements. It captures how variables move together.',
        formula: '\\Sigma = \\frac{1}{m-1} (X - \\bar{X})^T (X - \\bar{X})'
      },
      {
        title: 'Eigendecomposition',
        content: 'We decompose the Covariance Matrix into eigenvectors (v) and eigenvalues (lambda).',
        formula: '\\Sigma v = \\lambda v'
      },
      {
        title: 'Projection',
        content: 'New data X_new is formed by the dot product of old data X and the top k eigenvectors W.',
        formula: 'X_{new} = X \\cdot W_k'
      }
    ],
    useCases: ['Visualizing High-Dimensional Data (2D/3D)', 'Noise Reduction in Signals', 'Preprocessing for Supervised Learning', 'Face Recognition (Eigenfaces)'],
    viz: { type: 'pca' }
  }
];