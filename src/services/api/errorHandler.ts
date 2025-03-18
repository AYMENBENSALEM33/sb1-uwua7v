import { AxiosError } from 'axios';
import { ApiError } from './types';
import { LoggerService } from './logger';

export class ApiErrorHandler {
  constructor(private logger: LoggerService) {}

  handleError(error: unknown): ApiError {
    if (this.isAxiosError(error)) {
      return this.handleAxiosError(error);
    }
    return this.handleGenericError(error);
  }

  private isAxiosError(error: any): error is AxiosError {
    return error.isAxiosError === true;
  }

  private handleAxiosError(error: AxiosError): ApiError {
    const requestDetails = this.getRequestDetails(error);
    const responseDetails = this.getResponseDetails(error);
    const errorMessage = this.getErrorMessage(error);

    // Log detailed error information
    this.logger.error([
      '❌ Erreur API:',
      requestDetails,
      responseDetails,
      `Message: ${errorMessage}`,
      error.stack ? `Stack: ${error.stack}` : ''
    ].filter(Boolean).join('\n'));

    if (error.code === 'ECONNABORTED') {
      return { message: 'La requête a expiré', code: 'TIMEOUT' };
    }

    if (error.code === 'ERR_NETWORK') {
      return { message: 'Erreur de connexion réseau', code: 'NETWORK_ERROR' };
    }

    if (error.response) {
      const status = error.response.status;
      return { 
        message: this.getErrorMessageForStatus(status), 
        status,
        details: error.response.data
      };
    }

    return { message: errorMessage };
  }

  private getRequestDetails(error: AxiosError): string {
    const config = error.config;
    if (!config) return '';

    return [
      '📤 Détails de la requête:',
      `${config.method?.toUpperCase()} ${config.url}`,
      'Headers:',
      ...Object.entries(config.headers || {})
        .filter(([key]) => !key.toLowerCase().includes('authorization'))
        .map(([key, value]) => `  ${key}: ${value}`),
      config.params ? `Paramètres: ${JSON.stringify(config.params, null, 2)}` : '',
      config.data ? `Corps: ${JSON.stringify(config.data, null, 2)}` : ''
    ].filter(Boolean).join('\n');
  }

  private getResponseDetails(error: AxiosError): string {
    if (!error.response) return '';

    return [
      '📥 Détails de la réponse:',
      `Status: ${error.response.status} ${error.response.statusText}`,
      'Headers:',
      ...Object.entries(error.response.headers)
        .map(([key, value]) => `  ${key}: ${value}`),
      'Data:',
      JSON.stringify(error.response.data, null, 2)
    ].join('\n');
  }

  private getErrorMessage(error: AxiosError): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return error.message || 'Une erreur inconnue est survenue';
  }

  private handleGenericError(error: unknown): ApiError {
    const message = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    this.logger.error([
      '❌ Erreur générique:',
      `Message: ${message}`,
      error instanceof Error && error.stack ? `Stack: ${error.stack}` : ''
    ].filter(Boolean).join('\n'));
    
    return { message };
  }

  private getErrorMessageForStatus(status: number): string {
    switch (status) {
      case 400:
        return 'Requête invalide - Vérifiez les données envoyées';
      case 401:
        return 'Erreur d\'authentification - Vérifiez vos identifiants';
      case 403:
        return 'Accès refusé - Vérifiez vos permissions';
      case 404:
        return 'Ressource non trouvée';
      case 408:
        return 'Délai d\'attente dépassé';
      case 429:
        return 'Trop de requêtes - Veuillez réessayer plus tard';
      case 500:
        return 'Erreur serveur interne';
      case 502:
        return 'Erreur de passerelle';
      case 503:
        return 'Service indisponible';
      case 504:
        return 'Délai de passerelle dépassé';
      default:
        return `Erreur HTTP ${status}`;
    }
  }
}