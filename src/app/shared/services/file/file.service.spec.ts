import { TestBed } from '@angular/core/testing';

import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;
  let createElementSpy: jasmine.Spy;
  let createObjectURLSpy: jasmine.Spy;
  let revokeObjectURLSpy: jasmine.Spy;
  let mockLink: jasmine.SpyObj<HTMLAnchorElement>;

  beforeEach(() => {
    mockLink = jasmine.createSpyObj('HTMLAnchorElement', ['click']);
    createElementSpy = spyOn(document, 'createElement').and.returnValue(mockLink as unknown as HTMLElement);
    createObjectURLSpy = spyOn(URL, 'createObjectURL').and.returnValue('blob:mock-url');
    revokeObjectURLSpy = spyOn(URL, 'revokeObjectURL');

    TestBed.configureTestingModule({
      providers: [FileService]
    });

    service = TestBed.inject(FileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveFile', () => {
    it('should trigger file download', () => {
      const mockBlob = new Blob(['test'], { type: 'application/pdf' });
      const filename = 'test.pdf';

      service.saveFile(mockBlob, filename);

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(createObjectURLSpy).toHaveBeenCalledWith(mockBlob);
      expect(mockLink.href).toBe('blob:mock-url');
      expect(mockLink.download).toBe(filename);
      expect(mockLink.click).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should handle different file types', () => {
      const mockBlob = new Blob(['image data'], { type: 'image/png' });
      const filename = 'image.png';

      service.saveFile(mockBlob, filename);

      expect(createObjectURLSpy).toHaveBeenCalledWith(mockBlob);
      expect(mockLink.download).toBe(filename);
      expect(mockLink.click).toHaveBeenCalled();
    });
  });
});