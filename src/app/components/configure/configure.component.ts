import {
  Component,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { HomeTemplateComponent } from '../home-template/home-template.component';
import { ConfigurationService } from '../../services/configuration.service';
import { Configuration } from '../../util/configuration';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-configure',
  standalone: true,
  imports: [
    HomeTemplateComponent,
    InputNumberModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TooltipModule,
    ToastModule,
  ],
  templateUrl: './configure.component.html',
  styleUrl: './configure.component.css',
  providers: [MessageService],
})
export class ConfigureComponent implements OnInit {
  form: FormGroup;

  configDetails: WritableSignal<Configuration | null> = signal(null);

  constructor(
    private configurationService: ConfigurationService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      maxCapacity: ['', Validators.required],
      releaseRate: ['', Validators.required],
      retrievalRate: ['', Validators.required],
    });
  }

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Configuration updated successfully',
    });
  }

  ngOnInit(): void {
    this.configurationService.getConfiguration().subscribe((config) => {
      this.configDetails.set(config);
      this.form = this.fb.group({
        maxCapacity: [this.configDetails()?.maxCapacity, Validators.required],
        releaseRate: [this.configDetails()?.releaseRate, Validators.required],
        retrievalRate: [
          this.configDetails()?.retrievalRate,
          Validators.required,
        ],
      });
    });
  }

  saveConfiguration() {
    const { maxCapacity, releaseRate, retrievalRate } = this.form.value;
    const updatedConfig: Configuration = {
      maxCapacity,
      releaseRate,
      retrievalRate,
    };

    this.configurationService.updateConfiguration(updatedConfig);
    this.showSuccess();
  }
}
