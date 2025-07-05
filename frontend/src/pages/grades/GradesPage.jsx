import { useTranslation } from 'react-i18next';
import GradesList from '../../components/grades/GradesList';

const GradesPage = ({ user }) => {
  const { t } = useTranslation();

  return (
    <div className="h-full">
      <GradesList user={user} />
    </div>
  );
};

export default GradesPage;