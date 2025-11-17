import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, Eye, Check, X, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: string;
  positions_available: number;
  created_at: string;
}

interface Applicant {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  position_applied: string;
  status: string;
  application_date: string;
}

export default function Recruitment() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showApplicantDialog, setShowApplicantDialog] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time',
    positions_available: 1,
  });

  // Mock data for demonstration
  const jobPostings: JobPosting[] = [
    {
      id: '1',
      title: 'مطور برمجيات',
      department: 'IT',
      location: 'الرياض',
      type: 'دوام كامل',
      status: 'active',
      positions_available: 2,
      created_at: '2024-01-15',
    },
    {
      id: '2',
      title: 'مدير موارد بشرية',
      department: 'HR',
      location: 'جدة',
      type: 'دوام كامل',
      status: 'active',
      positions_available: 1,
      created_at: '2024-01-20',
    },
  ];

  const applicants: Applicant[] = [
    {
      id: '1',
      full_name: 'سارة أحمد',
      email: 'sara.ahmed@example.com',
      phone: '0501234567',
      position_applied: 'مطور برمجيات',
      status: 'pending',
      application_date: '2024-02-01',
    },
    {
      id: '2',
      full_name: 'خالد محمد',
      email: 'khaled.mohammed@example.com',
      phone: '0507654321',
      position_applied: 'مطور برمجيات',
      status: 'under_review',
      application_date: '2024-02-05',
    },
    {
      id: '3',
      full_name: 'نورة عبدالله',
      email: 'noura.abdullah@example.com',
      phone: '0509876543',
      position_applied: 'مدير موارد بشرية',
      status: 'interviewed',
      application_date: '2024-02-10',
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: t('recruitment.status.pending'), variant: 'secondary' as const },
      under_review: { label: t('recruitment.status.underReview'), variant: 'default' as const },
      interviewed: { label: t('recruitment.status.interviewed'), variant: 'default' as const },
      accepted: { label: t('recruitment.status.accepted'), variant: 'default' as const },
      rejected: { label: t('recruitment.status.rejected'), variant: 'destructive' as const },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const handleAcceptApplicant = (applicantId: string) => {
    toast.success(t('recruitment.acceptSuccess'));
  };

  const handleRejectApplicant = (applicantId: string) => {
    toast.success(t('recruitment.rejectSuccess'));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('recruitment.title')}</h1>
          <p className="text-muted-foreground">{t('recruitment.description')}</p>
        </div>
        <Button onClick={() => setShowJobDialog(true)}>
          <Briefcase className="h-4 w-4 mr-2" />
          {t('recruitment.addJob')}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('recruitment.activeJobs')}</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobPostings.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('recruitment.totalApplicants')}</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applicants.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('recruitment.pendingReview')}</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applicants.filter(a => a.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('recruitment.interviewed')}</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applicants.filter(a => a.status === 'interviewed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Postings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recruitment.jobPostings')}</CardTitle>
          <CardDescription>{t('recruitment.jobPostingsDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%] text-center">{t('recruitment.jobTitle')}</TableHead>
                <TableHead className="w-[15%] text-center">{t('recruitment.department')}</TableHead>
                <TableHead className="w-[15%] text-center">{t('recruitment.location')}</TableHead>
                <TableHead className="w-[15%] text-center">{t('recruitment.type')}</TableHead>
                <TableHead className="w-[15%] text-center">{t('recruitment.positions')}</TableHead>
                <TableHead className="w-[20%] text-center">{t('common.status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobPostings.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium text-center">{job.title}</TableCell>
                  <TableCell className="text-center">{job.department}</TableCell>
                  <TableCell className="text-center">{job.location}</TableCell>
                  <TableCell className="text-center">{job.type}</TableCell>
                  <TableCell className="text-center">{job.positions_available}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">{t('recruitment.jobStatus.active')}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Applicants */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recruitment.applicants')}</CardTitle>
          <CardDescription>{t('recruitment.applicantsDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%] text-center">{t('recruitment.applicantName')}</TableHead>
                <TableHead className="w-[20%] text-center">{t('recruitment.email')}</TableHead>
                <TableHead className="w-[12%] text-center">{t('recruitment.phone')}</TableHead>
                <TableHead className="w-[15%] text-center">{t('recruitment.position')}</TableHead>
                <TableHead className="w-[13%] text-center">{t('recruitment.applicationDate')}</TableHead>
                <TableHead className="w-[13%] text-center">{t('common.status')}</TableHead>
                <TableHead className="w-[12%] text-center">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell className="font-medium text-center">{applicant.full_name}</TableCell>
                  <TableCell className="text-center">{applicant.email}</TableCell>
                  <TableCell className="text-center">{applicant.phone}</TableCell>
                  <TableCell className="text-center">{applicant.position_applied}</TableCell>
                  <TableCell className="text-center">{applicant.application_date}</TableCell>
                  <TableCell className="text-center">{getStatusBadge(applicant.status)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApplicant(applicant);
                          setShowApplicantDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {applicant.status === 'pending' && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAcceptApplicant(applicant.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRejectApplicant(applicant.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Job Dialog */}
      <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('recruitment.addJob')}</DialogTitle>
            <DialogDescription>{t('recruitment.addJobDescription')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t('recruitment.jobTitle')}</Label>
              <Input
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                placeholder={t('recruitment.jobTitlePlaceholder')}
              />
            </div>
            <div>
              <Label>{t('recruitment.department')}</Label>
              <Input
                value={jobForm.department}
                onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                placeholder={t('recruitment.departmentPlaceholder')}
              />
            </div>
            <div>
              <Label>{t('recruitment.location')}</Label>
              <Input
                value={jobForm.location}
                onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                placeholder={t('recruitment.locationPlaceholder')}
              />
            </div>
            <div>
              <Label>{t('recruitment.type')}</Label>
              <Select value={jobForm.type} onValueChange={(value) => setJobForm({ ...jobForm, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">{t('recruitment.jobType.fullTime')}</SelectItem>
                  <SelectItem value="part-time">{t('recruitment.jobType.partTime')}</SelectItem>
                  <SelectItem value="contract">{t('recruitment.jobType.contract')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('recruitment.positions')}</Label>
              <Input
                type="number"
                value={jobForm.positions_available}
                onChange={(e) => setJobForm({ ...jobForm, positions_available: parseInt(e.target.value) })}
                min="1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJobDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={() => {
              toast.success(t('recruitment.jobAddedSuccess'));
              setShowJobDialog(false);
            }}>
              {t('common.add')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Applicant Details Dialog */}
      <Dialog open={showApplicantDialog} onOpenChange={setShowApplicantDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('recruitment.applicantDetails')}</DialogTitle>
          </DialogHeader>
          {selectedApplicant && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">{t('recruitment.applicantName')}</Label>
                  <p className="font-medium">{selectedApplicant.full_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('recruitment.email')}</Label>
                  <p className="font-medium">{selectedApplicant.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('recruitment.phone')}</Label>
                  <p className="font-medium">{selectedApplicant.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('recruitment.position')}</Label>
                  <p className="font-medium">{selectedApplicant.position_applied}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('recruitment.applicationDate')}</Label>
                  <p className="font-medium">{selectedApplicant.application_date}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('common.status')}</Label>
                  <div className="mt-1">{getStatusBadge(selectedApplicant.status)}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplicantDialog(false)}>
              {t('common.cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}