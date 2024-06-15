import { JobType, JobTypeList } from '@/types/jobs';
import { useRouter, useSearchParams } from 'next/navigation';
import { Label } from '../ui/label';

const JobTypeCheckBoxes = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const recruits = searchParams.getAll('recruit') as string[];

  const handleRecruitChange = (value: JobType) => {
    const locationParams = new URLSearchParams(window.location.search);

    if (recruits?.includes(value)) {
      locationParams.delete('recruit');
      const recruitList = recruits.filter((v) => v !== value);
      recruitList.forEach((v) => locationParams.append('recruit', v));
    } else {
      locationParams.append('recruit', value);
    }
    const newUrl = `${window.location.pathname}?${locationParams.toString()}`;
    router.push(newUrl, {
      scroll: false,
    });
  };

  return (
    <div className="mt-8">
      <h4 className="text-lg font-semibold">직군</h4>

      {JobTypeList.map(({ title, value }) => (
        <div className="flex items-center my-2" key={value}>
          <input
            type="checkbox"
            value={value}
            checked={recruits.includes(value)}
            className="w-5 h-5 border-gray-400 checked:bg-main rounded"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleRecruitChange(value)
            }
          />
          <Label htmlFor={title} className="ml-2 text-lg">
            {title}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default JobTypeCheckBoxes;
