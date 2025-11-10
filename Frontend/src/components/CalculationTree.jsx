import { useState, useEffect } from 'react';
import { Spin, Empty, message } from 'antd';
import CalculationNode from './CalculationNode';
import api from '../services/api';

const CalculationTree = ({ refreshTrigger }) => {
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCalculations = async () => {
    try {
      setLoading(true);
      const data = await api.getAllCalculations();
      setCalculations(data.calculations || []);
    } catch (error) {
      message.error('Failed to load calculations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalculations();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (calculations.length === 0) {
    return (
      <Empty
        description="No calculations yet. Be the first to start a calculation tree!"
        style={{ padding: '50px' }}
      />
    );
  }

  return (
    <div className="calculation-tree">
      {calculations.map((calculation) => (
        <CalculationNode
          key={calculation.id}
          calculation={calculation}
          level={0}
          onOperationAdded={fetchCalculations}
        />
      ))}
    </div>
  );
};

export default CalculationTree;

